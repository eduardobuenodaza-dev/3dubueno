exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { messages } = JSON.parse(event.body);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: 'Eres el asistente virtual de 3DUBUENO Consulting, fundada por Eduardo Bueno Daza. Servicios: 1) HSE y Prevencion de Riesgos (ISO 45001, Ley 16.744, IPER) 2) Gestion Ambiental ISO 14001 3) Normativa y RCA (SEREMI, SMA, permisos). Identifica la necesidad, recomienda el servicio adecuado e invita a agendar diagnostico. Contacto: eduardo.bueno.daza@gmail.com. Responde en espanol, maximo 3 parrafos.',
        messages
      })
    });
    const data = await response.json();
    const reply = data.content && data.content[0] ? data.content[0].text : 'No pude procesar tu consulta.';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Error interno.' })
    };
  }
};
