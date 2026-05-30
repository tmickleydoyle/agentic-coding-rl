import {
  createCard,
  deleteCard,
  findCard,
  isColumn,
  listCards,
  updateCard,
} from '../../../lib/store'
import type { Column } from '../../../lib/types'

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

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const cards = listCards({
    column: params.get('column'),
    archived: params.get('archived'),
  })
  return json({ cards })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const card = createCard({ title: title.trim() })
  return json(card, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findCard(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { column?: Column; archived?: boolean } = {}
  if (body.column !== undefined) {
    if (!isColumn(body.column)) return json({ error: 'invalid column' }, 400)
    patch.column = body.column
  }
  if (typeof body.archived === 'boolean') patch.archived = body.archived
  const updated = updateCard(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteCard(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
