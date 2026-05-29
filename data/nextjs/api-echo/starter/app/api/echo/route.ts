export async function GET(req: Request): Promise<Response> {
  // TODO: echo all query params as { method, query }
  void req
  return new Response(JSON.stringify({ error: 'not implemented' }), {
    status: 501,
    headers: { 'content-type': 'application/json' },
  })
}

export async function POST(req: Request): Promise<Response> {
  // TODO: parse JSON body, echo under { received }; 400 on invalid JSON
  void req
  return new Response(JSON.stringify({ error: 'not implemented' }), {
    status: 501,
    headers: { 'content-type': 'application/json' },
  })
}
