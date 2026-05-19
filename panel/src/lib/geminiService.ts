import { getBotConfig } from './botConfig';

export interface GeminiIntentResponse {
  response: string;
  action: 'none' | 'save_profile' | 'book_visit' | 'create_consultation';
  clientProfileUpdate?: {
    nombre?: string | null;
    presupuesto_min?: number | null;
    presupuesto_max?: number | null;
    zona_preferida?: string | null;
    tipo_busqueda?: 'venta' | 'alquiler' | null;
    categoria_preferida?: 'casa' | 'departamento' | 'local' | 'terreno' | 'oficina' | 'campo' | null;
  };
  visitBooking?: {
    fecha?: string | null; // YYYY-MM-DD
    hora?: string | null;  // HH:MM
    propiedadId?: string | null;
    notas?: string | null;
  };
  consultationRegister?: {
    propiedadId?: string | null;
    mensaje?: string | null;
  };
}

export async function processMessageWithAI(
  telefono: string,
  nombreCliente: string | null,
  mensajeUsuario: string,
  historialChat: any[],
  propiedadesCatalogo: any[]
): Promise<GeminiIntentResponse> {
  const config = getBotConfig();
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API Key is missing in configuration.');
    return {
      response: '¡Hola! Disculpa la molestia, pero nuestro asistente virtual se encuentra temporalmente en mantenimiento técnico. Un asesor humano se comunicará contigo a la brevedad. ¡Muchas gracias por tu paciencia!',
      action: 'none'
    };
  }

  // Prep properties for context
  const propiedadesResumen = propiedadesCatalogo.map(p => ({
    id: p.id,
    titulo: p.titulo,
    descripcion: p.descripcion,
    tipo: p.tipo, // 'venta' o 'alquiler'
    categoria: p.categoria, // 'casa', 'departamento', etc.
    precio: p.precio,
    moneda: p.moneda,
    zona: p.zona,
    direccion: p.direccion,
    ambientes: p.ambientes,
    banos: p.banos,
    superficie_m2: p.superficie_m2,
    disponible: p.disponible
  }));

  const systemInstruction = `
Eres un asistente de IA experto en bienes raíces para la prestigiosa inmobiliaria "InmoVisión", llamado "InmoBot".
Tu objetivo es atender a los clientes por WhatsApp de la forma más humana, cálida, empática y profesional posible.

PAUTAS DE COMPORTAMIENTO CONVERSACIONAL:
1. Habla de manera natural y cercana, como un asesor inmobiliario humano altamente capacitado. Usa expresiones amables de vez en cuando (e.g. "¡Qué buena elección!", "Totalmente de acuerdo", "Con gusto te ayudo").
2. NO saludes robóticamente en cada mensaje si ya estás en una conversación fluida.
3. Evita las respuestas estructuradas o listas aburridas. Incorpora la información en oraciones continuas y fluidas. Menciona los precios en la moneda correspondiente (USD o ARS) y destaca los beneficios de las propiedades.
4. Si te preguntan por propiedades, usa únicamente la lista de propiedades del catálogo provista más abajo. Recomienda activamente las que mejor se adapten al presupuesto y zona del cliente. Si no hay propiedades idénticas, sugiereles alternativas cercanas amablemente.
5. Intenta capturar con delicadeza la información del perfil del cliente (nombre, qué busca, presupuesto, zona favorita).
6. Si el cliente expresa interés real en una propiedad y quiere visitarla, invítalo a agendar una visita proponiendo fecha y hora de manera informal pero coordinada.
7. Tus respuestas deben ser cortas y ágiles para WhatsApp (máximo 2 a 3 párrafos cortos).

REQUERIMIENTO TÉCNICO:
Debes responder SIEMPRE en formato JSON estructurado que cumpla exactamente con el siguiente esquema JSON para que nuestro sistema pueda procesar las acciones y guardar los datos:

\`\`\`json
{
  "response": "Tu mensaje humanizado redactado para enviar al cliente por WhatsApp (en español)",
  "action": "none" | "save_profile" | "book_visit" | "create_consultation",
  "clientProfileUpdate": {
    "nombre": "nombre del cliente si lo menciona, de lo contrario null",
    "presupuesto_min": número si lo menciona o infieres, de lo contrario null",
    "presupuesto_max": número si lo menciona o infieres, de lo contrario null",
    "zona_preferida": "zona preferida si la menciona, de lo contrario null",
    "tipo_busqueda": "venta" | "alquiler" | null,
    "categoria_preferida": "casa" | "departamento" | "local" | "terreno" | "oficina" | "campo" | null
  },
  "visitBooking": {
    "fecha": "fecha de la visita en formato YYYY-MM-DD si el cliente solicitó agendar o coordinó una fecha, de lo contrario null",
    "hora": "hora en formato HH:MM si el cliente solicitó agendar o coordinó una hora, de lo contrario null",
    "propiedadId": "el UUID de la propiedad seleccionada si aplica, de lo contrario null",
    "notas": "detalles breves adicionales para la visita o null"
  },
  "consultationRegister": {
    "propiedadId": "el UUID de la propiedad consultada si aplica, de lo contrario null",
    "mensaje": "resumen corto de la consulta o null"
  }
}
\`\`\`

REGLAS DE ACCIÓN:
- "save_profile": Usa esta acción si el cliente brinda nuevos datos personales, presupuesto o preferencias de búsqueda.
- "book_visit": Usa esta acción ÚNICAMENTE si el cliente ha acordado o solicitado agendar una visita indicando fecha y hora específicas (e.g., "mañana a las 16", "el viernes a las 10:00"). Asegúrate de completar los campos fecha y hora.
- "create_consultation": Usa esta acción si el cliente hace una pregunta muy específica de una propiedad que no puedes responder con los datos del catálogo o si deja una queja/duda formal para que un asesor humano lo contacte.
- Si no hay ninguna acción clara, usa "none".

DATOS DE CONTEXTO ACTUAL:
- Cliente Nombre actual en sistema: ${nombreCliente || 'No registrado'}
- Cliente Teléfono: ${telefono}

HISTORIAL RECIENTE DEL CHAT:
${JSON.stringify(historialChat.slice(-10), null, 2)}

CATÁLOGO DE PROPIEDADES DISPONIBLES EN INMOBILIARIA INMOVISIÓN:
${JSON.stringify(propiedadesResumen, null, 2)}
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `El cliente envía: "${mensajeUsuario}"\n\nProcesa este mensaje y genera la respuesta JSON adecuada.` }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const resData = await res.json();
    const textOutput = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error('No text generated by Gemini');
    }

    const parsed: GeminiIntentResponse = JSON.parse(textOutput.trim());
    return parsed;

  } catch (error: any) {
    console.error('Error generating AI response with Gemini:', error);
    return {
      response: '¡Hola! Gracias por comunicarte con InmoVisión. He recibido tu mensaje, pero en este momento tengo un retraso en procesar tu solicitud. ¿Te gustaría dejar tu nombre para que uno de nuestros asesores te llame directamente?',
      action: 'none'
    };
  }
}
