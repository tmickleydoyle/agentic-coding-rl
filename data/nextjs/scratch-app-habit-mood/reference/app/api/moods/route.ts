import { deleteEntry, listEntries, upsertEntry } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function GET(_req: Request): Promise<Response> {
  return json({ entries: listEntries() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const date = body.date
  const score = body.score
  if (typeof date !== 'string' || date.trim().length === 0) {
    return json({ error: 'date required' }, 400)
  }
  if (
    typeof score !== 'number' ||
    Number.isNaN(score) ||
    score < 1 ||
    score > 5
  ) {
    return json({ error: 'score invalid' }, 400)
  }
  const triggers = Array.isArray(body.triggers)
    ? body.triggers.filter((t): t is string => typeof t === 'string')
    : []
  const entry = upsertEntry({ date, score, triggers })
  return json(entry, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEntry(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
