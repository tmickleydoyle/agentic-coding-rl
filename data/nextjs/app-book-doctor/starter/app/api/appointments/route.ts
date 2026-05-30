import {
  createAppointment,
  deleteAppointment,
  findProvider,
  isSlotTaken,
  listAppointments,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { appointments } applying ?providerId= and ?when= filters
  void req
  void listAppointments
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an appointment; 400 invalid, 422 slot unavailable, 409 slot taken
  void req
  void createAppointment
  void findProvider
  void isSlotTaken
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteAppointment
  return json({ error: 'not implemented' }, 501)
}
