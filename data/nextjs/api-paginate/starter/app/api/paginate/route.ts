const DATA: number[] = Array.from({ length: 25 }, (_, i) => i + 1)

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: paginate DATA by ?page & ?limit; clamp page; 400 on bad params
  void req
  void DATA
  return json({ error: 'not implemented' }, 501)
}
