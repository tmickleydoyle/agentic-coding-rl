import {
  createTicket,
  deleteTicket,
  escalateTicket,
  findTicket,
  listTickets,
  respondTicket,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { tickets } applying the ?breached=true filter
  void req
  void listTickets
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a ticket from { subject, priority?, slaMinutes?, elapsedMinutes? };
  // 400 if subject blank
  void req
  void createTicket
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= with { action: 'respond' | 'escalate' }; 404 if absent, 400 on unknown action
  void req
  void findTicket
  void respondTicket
  void escalateTicket
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteTicket
  return json({ error: 'not implemented' }, 501)
}
