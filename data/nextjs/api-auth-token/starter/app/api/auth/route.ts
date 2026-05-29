const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function POST(req: Request): Promise<Response> {
  // TODO: 400 if missing; 200 token-<username> for admin/secret; else 401
  void req
  return json({ error: 'not implemented' }, 501)
}
