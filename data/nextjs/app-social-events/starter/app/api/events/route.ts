import { createEvent, deleteEvent, findEvent, listEvents, updateEvent } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { events } applying ?when=upcoming|past
  void req
  void listEvents
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an event from { title, day? }; 400 if title blank
  void req
  void createEvent
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set rsvp (400 invalid rsvp); 404 if absent
  void req
  void findEvent
  void updateEvent
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteEvent
  return json({ error: 'not implemented' }, 501)
}
