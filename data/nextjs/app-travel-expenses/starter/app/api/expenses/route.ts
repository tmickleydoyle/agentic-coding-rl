import {
  createExpense,
  deleteExpense,
  findTrip,
  listExpenses,
  listTrips,
  tripTotal,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: no params => { trips } with total; ?tripId= => { trip, expenses, total } or 404
  void req
  void listTrips
  void findTrip
  void listExpenses
  void tripTotal
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create expense; 404 missing trip, 400 if amount not > 0
  void req
  void createExpense
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteExpense
  return json({ error: 'not implemented' }, 501)
}
