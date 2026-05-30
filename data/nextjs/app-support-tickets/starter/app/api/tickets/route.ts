import {
  addReply,
  createTicket,
  deleteTicket,
  findTicket,
  listTickets,
  updateTicket,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { tickets } applying ?status=/?priority=/?assignee= filters
  void req
  void listTickets
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a ticket from { subject, requester?, priority? }; 400 if subject blank
  void req
  void createTicket
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= assign/status/priority or append a reply (replyBody); 404 if absent
  void req
  void findTicket
  void updateTicket
  void addReply
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteTicket
  return json({ error: 'not implemented' }, 501)
}
