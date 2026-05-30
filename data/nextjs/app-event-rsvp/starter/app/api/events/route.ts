import {
  createEvent,
  deleteEvent,
  isValidRsvp,
  listEvents,
  updateInvite,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { events } applying an optional ?id= filter
  void req
  void listEvents
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an event; 400 invalid name
  void req
  void createEvent
  return json({ error: 'not implemented' }, 501)
}

export async function PATCH(req: Request): Promise<Response> {
  // TODO: update an invite RSVP; 404 unknown event/invite, 400 invalid rsvp
  void req
  void updateInvite
  void isValidRsvp
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteEvent
  return json({ error: 'not implemented' }, 501)
}
