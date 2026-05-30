import {
  createBooking,
  deleteBooking,
  hasConflict,
  listBookings,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { bookings } applying ?roomId= filter
  void req
  void listBookings
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a booking; 400 if invalid, 409 on overlap
  void req
  void createBooking
  void hasConflict
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteBooking
  return json({ error: 'not implemented' }, 501)
}
