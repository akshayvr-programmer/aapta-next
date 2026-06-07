export const maxDuration = 30

export async function POST(request) {
  try {
    const { system, content } = await request.json()

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system,
        messages: [{ role: 'user', content }],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return Response.json({ error: data.error?.message ?? 'API error' }, { status: 400 })
    }

    return Response.json({ text: data.content?.[0]?.text ?? '' })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
