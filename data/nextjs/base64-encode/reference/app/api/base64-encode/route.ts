const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'text is required' }, 400)
  }

  const { text, mode } = body as Record<string, unknown>

  if (typeof text !== 'string') {
    return json({ error: 'text is required' }, 400)
  }
  if (mode !== 'encode' && mode !== 'decode') {
    return json({ error: 'mode must be encode or decode' }, 400)
  }

  if (mode === 'encode') {
    return json({ result: btoa(text) })
  } else {
    try {
      return json({ result: atob(text) })
    } catch {
      return json({ error: 'invalid base64 input' }, 400)
    }
  }
}
