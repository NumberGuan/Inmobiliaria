import { NextResponse } from 'next/server';
import { getBotConfig } from '@/lib/botConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getBotConfig();
    const { openWaUrl, sessionName, openWaApiKey } = config;

    if (!openWaUrl) {
      return NextResponse.json({
        gatewayReached: false,
        sessionActive: false,
        status: 'OFFLINE',
        message: 'La URL de OpenWA no está configurada.'
      }, { status: 200 });
    }

    const headers: Record<string, string> = {};
    if (openWaApiKey) {
      headers['X-API-Key'] = openWaApiKey;
    }

    let sessionActive = false;
    let gatewayReached = false;
    let qrCodeString: string | null = null;
    let statusText = 'OFFLINE';
    let sessionUuid: string | null = null;

    // 1. Fetch all sessions to find our session and resolve its UUID
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

      console.log(`Listing sessions at: ${openWaUrl}/api/sessions`);
      const res = await fetch(`${openWaUrl}/api/sessions`, {
        method: 'GET',
        headers,
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      gatewayReached = true;

      if (res.ok) {
        const sessions = await res.json();
        console.log('Registered sessions in OpenWA:', sessions);

        const found = Array.isArray(sessions) 
          ? sessions.find((s: any) => s.name === sessionName) 
          : null;

        if (found) {
          sessionUuid = found.id;
          const state = (found.status || found.state || '').toUpperCase();
          console.log(`Found session ${sessionName} with UUID ${sessionUuid} and status ${state}`);

          if (state === 'CONNECTED' || state === 'AUTHENTICATED' || state === 'READY' || found.connected) {
            sessionActive = true;
            statusText = 'CONNECTED';
          } else if (state === 'SCAN_QR' || state === 'QR' || state === 'WAITING_FOR_LOGIN' || state === 'QR_READY') {
            statusText = 'SCAN_QR';
          } else if (state === 'CREATED') {
            statusText = 'NOT_INITIALIZED'; // Exists in DB but engine not started
          } else if (state === 'DISCONNECTED' || state === 'FAILED' || state === 'LOGOUT' || state === 'CLOSED') {
            console.log(`Session ${sessionName} is in failed state '${state}'. Deleting to reset...`);
            try {
              await fetch(`${openWaUrl}/api/sessions/${sessionUuid}`, {
                method: 'DELETE',
                headers,
                cache: 'no-store'
              });
            } catch (delErr) {
              console.error('Error deleting failed session:', delErr);
            }
            sessionUuid = null;
            statusText = 'NOT_INITIALIZED';
          } else {
            statusText = state || 'STARTING';
          }
        } else {
          statusText = 'NOT_INITIALIZED';
        }
      } else {
        statusText = `GATEWAY_ERROR_${res.status}`;
      }
    } catch (fetchError: any) {
      console.warn('Could not contact OpenWA gateway:', fetchError.message);
      return NextResponse.json({
        gatewayReached: false,
        sessionActive: false,
        status: 'OFFLINE',
        message: 'No se pudo contactar con la pasarela OpenWA. Asegúrate de que Docker o el servidor local OpenWA esté corriendo.'
      }, { status: 200 });
    }

    // 2. If session does not exist or is just "CREATED", initialize or start it
    if (statusText === 'NOT_INITIALIZED') {
      try {
        if (!sessionUuid) {
          console.log(`Creating session '${sessionName}' in OpenWA...`);
          const createRes = await fetch(`${openWaUrl}/api/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({ name: sessionName })
          });
          if (createRes.ok) {
            const newSession = await createRes.json();
            sessionUuid = newSession.id;
            console.log(`Created new session with UUID: ${sessionUuid}`);
          }
        }

        if (sessionUuid) {
          console.log(`Starting session ${sessionUuid} in OpenWA...`);
          const startRes = await fetch(`${openWaUrl}/api/sessions/${sessionUuid}/start`, { 
            method: 'POST', 
            headers 
          });
          if (startRes.ok) {
            statusText = 'STARTING';
            console.log(`Session ${sessionUuid} started successfully.`);
          }
        }
      } catch (e) {
        console.error('Error auto-creating or starting session:', e);
      }
    }

    // 3. If session is SCAN_QR, STARTING, INITIALIZING, or WAITING_FOR_LOGIN, fetch its QR code
    if (statusText === 'SCAN_QR' || statusText === 'STARTING' || statusText === 'INITIALIZING' || statusText === 'WAITING_FOR_LOGIN') {
      if (sessionUuid) {
        try {
          console.log(`Fetching QR Code for session ${sessionUuid} from OpenWA...`);
          const qrRes = await fetch(`${openWaUrl}/api/sessions/${sessionUuid}/qr`, {
            method: 'GET',
            headers,
            cache: 'no-store'
          });
          if (qrRes.ok) {
            const qrData = await qrRes.json();
            qrCodeString = qrData.qr || qrData.code || qrData.qrCode || (typeof qrData === 'string' ? qrData : null);
            statusText = 'SCAN_QR';
          }
        } catch (qrError) {
          console.error('Error fetching QR from OpenWA:', qrError);
        }
      }
    }
    // 4. If connected, ensure webhook is registered
    if (sessionActive && sessionUuid) {
      try {
        console.log(`Checking webhooks for session ${sessionUuid}...`);
        const whRes = await fetch(`${openWaUrl}/api/sessions/${sessionUuid}/webhooks`, {
          method: 'GET',
          headers,
          cache: 'no-store'
        });
        if (whRes.ok) {
          const webhooks = await whRes.json();
          const hasWebhook = Array.isArray(webhooks) && webhooks.some((w: any) => w.url.includes('/api/webhook/whatsapp'));
          if (!hasWebhook) {
            console.log(`Webhook not registered for session ${sessionUuid}. Registering...`);
            const isLocalGateway = openWaUrl.includes('localhost') || openWaUrl.includes('127.0.0.1');
            const webhookUrl = isLocalGateway 
              ? 'http://host.docker.internal:3000/api/webhook/whatsapp'
              : 'http://localhost:3000/api/webhook/whatsapp';
              
            await fetch(`${openWaUrl}/api/sessions/${sessionUuid}/webhooks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...headers },
              body: JSON.stringify({
                url: webhookUrl,
                events: ['message.received']
              })
            });
            console.log(`Registered webhook: ${webhookUrl}`);
          }
        }
      } catch (whErr) {
        console.error('Error checking or registering webhook:', whErr);
      }
    }

    return NextResponse.json({
      gatewayReached,
      sessionActive,
      status: statusText,
      qrCodeString,
      sessionName,
      message: sessionActive 
        ? '¡Bot conectado y listo para procesar mensajes!' 
        : statusText === 'SCAN_QR' 
          ? 'Por favor, escanea el código QR desde tu app de WhatsApp en el celular para iniciar sesión.' 
          : 'Iniciando sesión en la pasarela, aguarda un momento...'
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      gatewayReached: false,
      sessionActive: false,
      status: 'ERROR',
      message: `Error interno de consulta de estado: ${error.message}`
    }, { status: 500 });
  }
}
