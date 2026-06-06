export async function GET(req: Request): Promise<Response> {
  void req
  return new Response(JSON.stringify({ error: 'not implemented' }), {
    status: 501,
    headers: { 'content-type': 'application/json' },
  })
}
