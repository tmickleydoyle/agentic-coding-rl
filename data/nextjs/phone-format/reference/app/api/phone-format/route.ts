const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  const raw = query['phone']
  if (raw === undefined) {
    return json({ error: 'phone is required' }, 400)
  }

  const digits = raw.replace(/\D/g, '')

  if (digits.length !== 10) {
    return json({ error: 'phone must contain exactly 10 digits' }, 400)
  }

  const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`

  return json({ raw, formatted })
}
