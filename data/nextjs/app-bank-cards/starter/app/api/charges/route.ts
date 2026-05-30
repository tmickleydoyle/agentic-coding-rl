import { createCharge, findCard, listCharges } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { charges } applying ?cardId= filter
  void req
  void listCharges
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a charge from { cardId, merchant?, amount }; 400 invalid card, non-positive
  // amount, or frozen card
  void req
  void createCharge
  void findCard
  return json({ error: 'not implemented' }, 501)
}
