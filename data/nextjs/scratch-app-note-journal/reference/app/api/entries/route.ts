import {
  createEntry,
  deleteEntry,
  findEntry,
  listEntries,
  summary,
  updateEntry,
} from '../../../lib/store'
import type { Mood } from '../../../lib/types'

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

const VALID_MOODS = ['happy', 'neutral', 'sad']

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  if (params.get('summary') === '1') {
    return json({ summary: summary() })
  }
  const entries = listEntries({
    mood: params.get('mood'),
    date: params.get('date'),
  })
  return json({ entries })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const text = body.body
  if (typeof text !== 'string' || text.trim().length === 0) {
    return json({ error: 'body required' }, 400)
  }
  const mood = typeof body.mood === 'string' ? body.mood : undefined
  const date = typeof body.date === 'string' ? body.date : undefined
  const entry = createEntry({ body: text.trim(), mood, date })
  return json(entry, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findEntry(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { body?: string; mood?: Mood } = {}
  if (typeof body.body === 'string') patch.body = body.body
  if (typeof body.mood === 'string' && VALID_MOODS.includes(body.mood)) {
    patch.mood = body.mood as Mood
  }
  const updated = updateEntry(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEntry(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
