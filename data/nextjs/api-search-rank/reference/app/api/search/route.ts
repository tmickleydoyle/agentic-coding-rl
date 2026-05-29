interface Doc {
  id: number
  title: string
  body: string
}

const SEED: Doc[] = [
  { id: 1, title: 'apple banana', body: 'fruit basket with apple' },
  { id: 2, title: 'banana split', body: 'banana banana cream' },
  { id: 3, title: 'cherry pie', body: 'apple and cherry filling' },
  { id: 4, title: 'date night', body: 'plain text here' },
]

let docs: Doc[] = SEED.map((d) => ({ ...d }))

export function __reset(): void {
  docs = SEED.map((d) => ({ ...d }))
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const isInt = (s: string): boolean => /^-?\d+$/.test(s)

const tokenize = (s: string): string[] =>
  s
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)

function countWord(field: string, term: string): number {
  let n = 0
  for (const tok of tokenize(field)) {
    if (tok === term) n++
  }
  return n
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams

  const rawQ = params.get('q')
  const terms = rawQ ? tokenize(rawQ) : []
  if (terms.length === 0) return json({ error: 'q required' }, 400)

  let page = 1
  const rawPage = params.get('page')
  if (rawPage !== null) {
    if (!isInt(rawPage)) return json({ error: 'invalid page' }, 400)
    page = Number(rawPage)
    if (page < 1) return json({ error: 'invalid page' }, 400)
  }

  let limit = 10
  const rawLimit = params.get('limit')
  if (rawLimit !== null) {
    if (!isInt(rawLimit)) return json({ error: 'invalid limit' }, 400)
    limit = Number(rawLimit)
    if (limit < 1 || limit > 50) return json({ error: 'invalid limit' }, 400)
  }

  const scored = docs
    .map((d) => {
      let score = 0
      for (const term of terms) {
        score += 3 * countWord(d.title, term) + countWord(d.body, term)
      }
      return { id: d.id, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => (b.score - a.score) || (a.id - b.id))

  const start = (page - 1) * limit
  const results = scored.slice(start, start + limit)

  return json({ results, total: scored.length, page })
}
