interface Item {
  id: number
  name: string
}

const SEED: Item[] = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' },
  { id: 4, name: 'd' },
  { id: 5, name: 'e' },
  { id: 6, name: 'f' },
  { id: 7, name: 'g' },
]

let items: Item[] = SEED.map((i) => ({ ...i }))

export function __reset(): void {
  items = SEED.map((i) => ({ ...i }))
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: parse limit + cursor, validate, return page with nextCursor/hasMore
  void req
  void items
  return json({ error: 'not implemented' }, 501)
}
