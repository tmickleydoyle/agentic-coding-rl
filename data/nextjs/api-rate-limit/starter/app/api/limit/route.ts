const MAX = 3
let counts = new Map<string, number>()

export function __reset(): void {
  counts = new Map<string, number>()
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: increment per-key counter; 200 { count } until MAX, then 429
  void req
  void MAX
  void counts
  return json({ error: 'not implemented' }, 501)
}
