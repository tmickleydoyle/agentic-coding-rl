const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const text = params.get('text')
  if (text === null || text === '') {
    return json({ error: 'text is required' }, 400)
  }
  const result = text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return json({ result })
}
