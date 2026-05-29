interface Item {
  id: number
  name: string
}

const ITEMS: Item[] = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
  { id: 4, name: 'apricot' },
  { id: 5, name: 'Grape' },
]

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: filter ITEMS by case-insensitive substring of ?q on name
  void req
  void ITEMS
  return json({ error: 'not implemented' }, 501)
}
