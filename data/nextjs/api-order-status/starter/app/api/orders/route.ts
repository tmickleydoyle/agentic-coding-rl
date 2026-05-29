type State = 'pending' | 'paid' | 'shipped' | 'delivered'

let orders = new Map<number, State>()

export function __reset(): void {
  orders = new Map<number, State>([[1, 'pending']])
}
__reset()

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { id, state } or 404
  void req
  void orders
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: apply action transition; 404 unknown id; 409 invalid transition
  void req
  return json({ error: 'not implemented' }, 501)
}
