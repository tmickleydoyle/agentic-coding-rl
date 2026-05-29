interface Order {
  id: number
  state: string
  items: string[]
  history: string[]
}

let orders = new Map<number, Order>()

function seed(): Map<number, Order> {
  const m = new Map<number, Order>()
  m.set(1, { id: 1, state: 'draft', items: [], history: [] })
  m.set(2, { id: 2, state: 'submitted', items: ['widget'], history: [] })
  return m
}

export function __reset(): void {
  orders = seed()
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: read ?id, return { state, history } or 404
  void req
  void orders
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: read ?id + body { action }, run guarded transition
  void req
  return json({ error: 'not implemented' }, 501)
}
