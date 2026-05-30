import {
  createItem,
  deleteItem,
  findItem,
  listItems,
  updateItem,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { items } applying ?aisle= and ?bought= filters
  void req
  void listItems
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an item from the body; 400 on blank name
  void req
  void createItem
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set/toggle bought; 404 if absent
  void req
  void findItem
  void updateItem
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteItem
  return json({ error: 'not implemented' }, 501)
}
