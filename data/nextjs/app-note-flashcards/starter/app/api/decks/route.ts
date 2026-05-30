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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { cards } applying ?deckId= and ?known= filters
  void req
  void listCards
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a card from { deckId, front, back }; 400 if front/back blank
  void req
  void createCard
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set/toggle known; 404 if absent
  void req
  void findCard
  void updateCard
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteCard
  return json({ error: 'not implemented' }, 501)
}
