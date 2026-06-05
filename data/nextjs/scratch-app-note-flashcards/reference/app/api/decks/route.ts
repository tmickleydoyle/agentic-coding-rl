import {
  createCard,
  deleteCard,
  findCard,
  listCards,
  updateCard,
} from '../../../lib/store'

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
    deckId: params.get('deckId'),
    known: params.get('known'),
  })
  return json({ cards })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const front = body.front
  const back = body.back
  if (
    typeof front !== 'string' ||
    front.trim().length === 0 ||
    typeof back !== 'string' ||
    back.trim().length === 0
  ) {
    return json({ error: 'front and back required' }, 400)
  }
  const deckId = typeof body.deckId === 'string' ? body.deckId : undefined
  const card = createCard({ deckId, front: front.trim(), back: back.trim() })
  return json(card, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findCard(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { known?: boolean } = {}
  if (typeof body.known === 'boolean') patch.known = body.known
  else patch.known = !existing.known // no explicit known => toggle
  const updated = updateCard(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteCard(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
