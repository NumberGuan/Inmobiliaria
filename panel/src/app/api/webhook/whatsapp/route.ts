import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getBotConfig, addActivityLog } from '@/lib/botConfig';
import { processMessageWithAI } from '@/lib/geminiService';

export async function POST(req: Request) {
  try {
    const config = getBotConfig();

    // If bot is disabled, respond immediately with a success to stop retries
    if (!config.botActive) {
      return NextResponse.json({ status: 'ignored', reason: 'Bot is inactive' }, { status: 200 });
    }

    const payload = await req.json();
    console.log('Incoming WhatsApp Webhook Payload:', JSON.stringify(payload, null, 2));

    // Extract fields from rmyndharis/OpenWA event payload structure
    // Standard OpenWA webhook payload may contain:
    // { event: 'message.received', data: { from: '54911...', body: 'Hola...', ... } }
    // OR simple { from: '54911...', body: 'Hola...' }
    const eventType = payload.event;
    const msgData = payload.data || payload;

    const rawFrom = msgData.from || msgData.chatId || msgData.sender?.id;
    const mensajeText = msgData.body || msgData.text || msgData.content || '';

    if (!rawFrom || !mensajeText) {
      console.warn('Webhook received without sender or message text:', payload);
      return NextResponse.json({ status: 'ignored', reason: 'Missing sender or body' }, { status: 200 });
    }

    // Resolve session uuid and fetch contact info from OpenWA to resolve real phone number if LID is received
    let targetSessionId = config.sessionName;
    let resolvedPhone = '';
    let resolvedName = '';

    try {
      const listRes = await fetch(`${config.openWaUrl}/api/sessions`, {
        method: 'GET',
        headers: config.openWaApiKey ? { 'X-API-Key': config.openWaApiKey } : {},
        cache: 'no-store'
      });
      if (listRes.ok) {
        const sessions = await listRes.json();
        const found = Array.isArray(sessions) 
          ? sessions.find((s: any) => s.name === config.sessionName) 
          : null;
        if (found) {
          targetSessionId = found.id;
        }
      }
    } catch (listErr) {
      console.warn('Could not list sessions for webhook config:', listErr);
    }

    if (targetSessionId) {
      try {
        const contactRes = await fetch(`${config.openWaUrl}/api/sessions/${targetSessionId}/contacts/${rawFrom}`, {
          method: 'GET',
          headers: config.openWaApiKey ? { 'X-API-Key': config.openWaApiKey } : {},
          cache: 'no-store'
        });
        if (contactRes.ok) {
          const contactInfo = await contactRes.json();
          console.log('Resolved contact details from OpenWA:', contactInfo);
          const contactJid = contactInfo.id || '';
          if (contactJid.endsWith('@c.us')) {
            resolvedPhone = contactJid.split('@')[0].replace(/[^0-9]/g, '');
            console.log(`Resolved standard phone from contact JID: ${resolvedPhone}`);
          }
          resolvedName = contactInfo.pushName || contactInfo.name || '';
        }
      } catch (contactErr: any) {
        console.warn('Error querying contact from OpenWA:', contactErr.message);
      }
    }

    // Standardize phone number (fallback to raw JID number if resolution failed)
    let cleanPhone = resolvedPhone;
    if (!cleanPhone) {
      cleanPhone = rawFrom.toString().split('@')[0];
      cleanPhone = cleanPhone.replace(/[^0-9]/g, '');
    }

    if (!cleanPhone) {
      return NextResponse.json({ status: 'ignored', reason: 'Invalid phone' }, { status: 200 });
    }

    console.log(`Processing message from: ${cleanPhone} (raw: ${rawFrom}). Text: "${mensajeText}"`);

    // 1. Fetch or create Client in Supabase
    let client: any = null;
    const { data: existingClient, error: getClientError } = await supabase
      .from('clientes')
      .select('*')
      .eq('telefono', cleanPhone)
      .maybeSingle();

    if (getClientError) {
      console.error('Error fetching client from Supabase:', getClientError);
    }

    if (!existingClient) {
      // Create new client
      const { data: newClient, error: createClientError } = await supabase
        .from('clientes')
        .insert({
          telefono: cleanPhone,
          nombre: resolvedName || null,
          estado_conversacion: 'inicio',
          datos_conversacion: []
        })
        .select('*')
        .single();

      if (createClientError) {
        console.error('Error creating client in Supabase:', createClientError);
        // Fallback local memory client if DB fails to insert
        client = {
          id: null,
          telefono: cleanPhone,
          nombre: resolvedName || null,
          datos_conversacion: []
        };
      } else {
        client = newClient;
      }
    } else {
      client = existingClient;
      if (!client.nombre && resolvedName) {
        const { error: nameUpdateError } = await supabase
          .from('clientes')
          .update({ nombre: resolvedName })
          .eq('id', client.id);
        if (!nameUpdateError) {
          client.nombre = resolvedName;
          console.log(`Updated existing client name in DB to: ${resolvedName}`);
        }
      }
    }

    const clientId = client.id;
    const nombreCliente = client.nombre;
    let chatHistory = Array.isArray(client.datos_conversacion) ? client.datos_conversacion : [];

    // 2. Fetch available properties to feed LLM context
    const { data: propiedadesCatalogo } = await supabase
      .from('propiedades')
      .select('*')
      .eq('disponible', true);

    const catalog = propiedadesCatalogo || [];

    // 3. Process message using Gemini
    const aiResult = await processMessageWithAI(
      cleanPhone,
      nombreCliente,
      mensajeText,
      chatHistory,
      catalog
    );

    console.log('AI Processing Result:', JSON.stringify(aiResult, null, 2));

    // 4. Handle DB Actions based on AI output
    let actionDescription = 'Ninguna';
    if (clientId) {
      if (aiResult.action === 'save_profile' && aiResult.clientProfileUpdate) {
        const updateData: any = {};
        const profile = aiResult.clientProfileUpdate;

        if (profile.nombre) updateData.nombre = profile.nombre;
        if (profile.presupuesto_min !== undefined) updateData.presupuesto_min = profile.presupuesto_min;
        if (profile.presupuesto_max !== undefined) updateData.presupuesto_max = profile.presupuesto_max;
        if (profile.zona_preferida) updateData.zona_preferida = profile.zona_preferida;
        if (profile.tipo_busqueda) updateData.tipo_busqueda = profile.tipo_busqueda;
        if (profile.categoria_preferida) updateData.categoria_preferida = profile.categoria_preferida;

        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from('clientes')
            .update(updateData)
            .eq('id', clientId);

          if (updateError) console.error('Error updating client profile:', updateError);
          actionDescription = `Perfil Actualizado: ${JSON.stringify(updateData)}`;
        }
      } else if (aiResult.action === 'book_visit' && aiResult.visitBooking) {
        const booking = aiResult.visitBooking;

        if (booking.fecha && booking.hora) {
          const { error: visitError } = await supabase
            .from('visitas')
            .insert({
              cliente_id: clientId,
              propiedad_id: booking.propiedadId || null,
              fecha_propuesta: booking.fecha,
              hora_propuesta: booking.hora,
              estado: 'pendiente',
              notas: booking.notas || 'Agendado automáticamente por InmoBot'
            });

          if (visitError) {
            console.error('Error inserting visit:', visitError);
          } else {
            actionDescription = `Visita Agendada: Propiedad ID ${booking.propiedadId || 'No esp.'} para ${booking.fecha} ${booking.hora}`;
          }
        }
      } else if (aiResult.action === 'create_consultation' && aiResult.consultationRegister) {
        const cons = aiResult.consultationRegister;
        const { error: consError } = await supabase
          .from('consultas')
          .insert({
            cliente_id: clientId,
            propiedad_id: cons.propiedadId || null,
            mensaje: mensajeText,
            respuesta: aiResult.response
          });

        if (consError) {
          console.error('Error inserting consultation:', consError);
        } else {
          actionDescription = `Consulta Registrada: Propiedad ID ${cons.propiedadId || 'No esp.'}`;
        }
      }
    }

    // 5. Append message and response to Client conversation history
    if (clientId) {
      const updatedHistory = [
        ...chatHistory,
        { role: 'user', content: mensajeText },
        { role: 'model', content: aiResult.response }
      ].slice(-30); // Keep last 30 turns to save database space

      const { error: historyError } = await supabase
        .from('clientes')
        .update({ datos_conversacion: updatedHistory })
        .eq('id', clientId);

      if (historyError) {
        console.error('Error updating chat history in Supabase:', historyError);
      }
    }

    // 6. Log Activity for Dashboard Display
    addActivityLog(cleanPhone, mensajeText, aiResult.response, actionDescription);

    // 7. Send Response via OpenWA REST API Gateway (using resolved targetSessionId)
    const gatewayUrl = `${config.openWaUrl}/api/sessions/${targetSessionId}/messages/send-text`;
    const gatewayPayload = {
      chatId: rawFrom, // Reply exactly to where the message came from (supports both @c.us and @lid JIDs)
      text: aiResult.response
    };

    console.log(`Sending response back to WhatsApp Gateway JID (${rawFrom}): ${gatewayUrl}`);

    try {
      const sendRes = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.openWaApiKey ? { 'X-API-Key': config.openWaApiKey } : {})
        },
        body: JSON.stringify(gatewayPayload)
      });

      if (!sendRes.ok) {
        const sendErr = await sendRes.text();
        console.error(`WhatsApp Gateway send failed. Code ${sendRes.status}: ${sendErr}`);
      } else {
        console.log('WhatsApp message sent successfully.');
      }
    } catch (sendError) {
      console.error('Error calling WhatsApp Gateway API:', sendError);
    }

    return NextResponse.json({
      status: 'success',
      action: aiResult.action,
      actionDesc: actionDescription,
      replySent: true
    }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook processing exception:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
