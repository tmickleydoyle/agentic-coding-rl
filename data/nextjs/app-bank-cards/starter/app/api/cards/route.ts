import { createCard, isValidLast4, listCards, updateCard } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(_req: Request): Promise<Response> {
  // TODO: return { cards }
  void listCards
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a card from { label, last4, limit? }; 400 on blank label or invalid last4
  void req
  void createCard
  void isValidLast4
  return json({ error: 'not implemented' }, 501)
}

export async function PATCH(req: Request): Promise<Response> {
  // TODO: ?id= update { frozen?, limit? }; 404 if absent
  void req
  void updateCard
  return json({ error: 'not implemented' }, 501)
}
