import { createEvent, deleteEvent, isValidDay, listEvents } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { events } applying ?category= and ?day= filters
  void req
  void listEvents
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an event; 400 invalid title/category, 422 bad day
  void req
  void createEvent
  void isValidDay
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteEvent
  return json({ error: 'not implemented' }, 501)
}
