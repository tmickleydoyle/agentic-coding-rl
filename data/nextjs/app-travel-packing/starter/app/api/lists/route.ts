import {
  createItem,
  deleteItem,
  findItem,
  findTrip,
  listItems,
  listTrips,
  packedPercent,
  updateItem,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: no params => { trips } with percent; ?tripId= => { trip, items, percent } or 404
  void req
  void listTrips
  void findTrip
  void listItems
  void packedPercent
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create item from { tripId, name, category? }; 404 missing trip, 400 blank name
  void req
  void createItem
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set/toggle packed; 404 if absent
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
