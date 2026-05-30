import {
  createReservation,
  deleteReservation,
  findTable,
  isReserved,
  listReservations,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { reservations } applying ?tableId= and ?time= filters
  void req
  void listReservations
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a reservation; 400 invalid, 422 over capacity, 409 table taken
  void req
  void createReservation
  void findTable
  void isReserved
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteReservation
  return json({ error: 'not implemented' }, 501)
}
