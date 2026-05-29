const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function POST(req: Request): Promise<Response> {
  // TODO: compute add/sub/mul/div with validation
  void req
  return json({ error: 'not implemented' }, 501)
}
