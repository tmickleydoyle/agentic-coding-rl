import { createCharge, findCard, listCharges } from '../../../lib/store'

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
  const charges = listCharges({ cardId: params.get('cardId') })
  return json({ charges })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const cardId = body.cardId
  if (typeof cardId !== 'string') return json({ error: 'invalid card' }, 400)
  const card = findCard(cardId)
  if (!card) return json({ error: 'invalid card' }, 400)
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return json({ error: 'amount must be positive' }, 400)
  }
  if (card.frozen) return json({ error: 'card frozen' }, 400)
  const merchant = typeof body.merchant === 'string' ? body.merchant : ''
  const charge = createCharge({ cardId, merchant, amount })
  return json(charge, 201)
}
