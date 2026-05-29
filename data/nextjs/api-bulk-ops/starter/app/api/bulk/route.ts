interface Row {
  id: number
  value: number
}

let store = new Map<number, Row>()

function seed(): Map<number, Row> {
  const m = new Map<number, Row>()
  m.set(1, { id: 1, value: 10 })
  m.set(2, { id: 2, value: 20 })
  return m
}

export function __reset(): void {
  store = seed()
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function POST(req: Request): Promise<Response> {
  // TODO: validate all ops atomically; 400 on bad shape, 422 on invalid ops,
  // else apply and return { applied, state }
  void req
  void store
  return json({ error: 'not implemented' }, 501)
}
