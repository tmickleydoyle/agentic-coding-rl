const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

function isPalindrome(text: string): boolean {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '')
  const reversed = cleaned.split('').reverse().join('')
  return cleaned === reversed
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  if (!('text' in query)) {
    return json({ error: 'text query parameter is required' }, 400)
  }

  const text = query['text']
  return json({ text, isPalindrome: isPalindrome(text) })
}
