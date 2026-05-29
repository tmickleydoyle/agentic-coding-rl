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

const isInt = (s: string): boolean => /^-?\d+$/.test(s)

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams

  let limit = 2
  const rawLimit = params.get('limit')
  if (rawLimit !== null) {
    if (!isInt(rawLimit)) return json({ error: 'invalid limit' }, 400)
    limit = Number(rawLimit)
    if (limit < 1 || limit > 100) return json({ error: 'invalid limit' }, 400)
  }

  let afterId = -Infinity
  const rawCursor = params.get('cursor')
  if (rawCursor !== null) {
    let decoded: string
    try {
      decoded = atob(rawCursor)
    } catch {
      return json({ error: 'invalid cursor' }, 400)
    }
    if (!isInt(decoded)) return json({ error: 'invalid cursor' }, 400)
    afterId = Number(decoded)
  }

  const ordered = items.slice().sort((a, b) => a.id - b.id)
  const remaining = ordered.filter((it) => it.id > afterId)
  const page = remaining.slice(0, limit)
  const hasMore = remaining.length > page.length
  const nextCursor =
    hasMore && page.length > 0 ? btoa(String(page[page.length - 1].id)) : null

  return json({ items: page, nextCursor, hasMore })
}
