export async function POST(req: Request): Promise<Response> {
  // TODO: validate email (@ and .) and password (length >= 8)
  void req
  return new Response(JSON.stringify({ error: 'not implemented' }), {
    status: 501,
    headers: { 'content-type': 'application/json' },
  })
}
