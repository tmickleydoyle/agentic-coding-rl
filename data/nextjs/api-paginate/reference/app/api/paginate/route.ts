const DATA: number[] = Array.from({ length: 25 }, (_, i) => i + 1)

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const parseParam = (raw: string | null, fallback: number): number | null => {
  if (raw === null) return fallback
  if (!/^-?\d+$/.test(raw)) return null
  const n = Number(raw)
  if (!Number.isInteger(n) || n <= 0) return null
  return n
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const page = parseParam(params.get('page'), 1)
  const limit = parseParam(params.get('limit'), 10)
  if (page === null || limit === null) {
    return json({ error: 'invalid params' }, 400)
  }

  const total = DATA.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const clamped = Math.min(Math.max(page, 1), totalPages)
  const start = (clamped - 1) * limit
  const items = DATA.slice(start, start + limit)

  return json({ items, page: clamped, limit, total, totalPages })
}
