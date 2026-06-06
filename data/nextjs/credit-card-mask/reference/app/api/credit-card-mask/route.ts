const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  const numberParam = query['number']
  if (numberParam === undefined) {
    return json({ error: 'number is required' }, 400)
  }

  const digits = numberParam.replace(/\D/g, '')
  if (digits.length !== 16) {
    return json({ error: 'card number must contain exactly 16 digits' }, 400)
  }

  const last4 = digits.slice(12)
  const masked = `**** **** **** ${last4}`

  return json({ masked, last4 })
}
