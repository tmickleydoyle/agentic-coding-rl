import {
  addCard,
  dueCards,
  findDeck,
  gradeCard,
  listDecks,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { decks }, { deck } for ?id=, or { cards } for ?id=&due=1; 404 unknown
  void req
  void listDecks
  void findDeck
  void dueCards
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: add ?id= card from { front, back }; 404 unknown deck, 400 blank fields
  void req
  void addCard
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: grade ?id=&cardId= from { grade }; 400 invalid grade, 404 unknown deck/card
  void req
  void gradeCard
  return json({ error: 'not implemented' }, 501)
}
