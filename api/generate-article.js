export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_KEY is not configured on the server.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const { model, system, messages, max_tokens = 8192 } = body;

  if (!model || !system || !messages) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: model, system, messages' }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model, max_tokens, system, messages }),
    });

    const data = await upstream.json();

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Unexpected server error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
