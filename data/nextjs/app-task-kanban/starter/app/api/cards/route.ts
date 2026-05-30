import {
  createCard,
  deleteCard,
  findCard,
  isColumn,
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
  // TODO: return { cards } applying ?column= and ?archived= filters
  void req
  void listCards
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a backlog card from { title }; 400 if title blank
  void req
  void createCard
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set column and/or archived; 404 if absent; 400 on invalid column
  void req
  void findCard
  void updateCard
  void isColumn
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteCard
  return json({ error: 'not implemented' }, 501)
}
