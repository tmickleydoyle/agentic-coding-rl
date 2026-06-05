import { createCard, isValidLast4, listCards, updateCard } from '../../../lib/store'

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
  return json({ cards: listCards() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const label = body.label
  if (typeof label !== 'string' || label.trim().length === 0) {
    return json({ error: 'label required' }, 400)
  }
  if (!isValidLast4(body.last4)) {
    return json({ error: 'invalid last4' }, 400)
  }
  const limit = typeof body.limit === 'number' && body.limit >= 0 ? body.limit : 0
  const card = createCard({ label: label.trim(), last4: body.last4, limit })
  return json(card, 201)
}

export async function PATCH(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const body = await readBody(req)
  const patch: { frozen?: boolean; limit?: number } = {}
  if (typeof body.frozen === 'boolean') patch.frozen = body.frozen
  if (typeof body.limit === 'number') patch.limit = body.limit
  const card = updateCard(id, patch)
  if (!card) return json({ error: 'not found' }, 404)
  return json(card)
}
