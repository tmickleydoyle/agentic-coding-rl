const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => {
    query[k] = v
  })
  return json({ method: 'GET', query })
}

export async function POST(req: Request): Promise<Response> {
  let received: unknown
  try {
    received = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }
  return json({ received })
}
