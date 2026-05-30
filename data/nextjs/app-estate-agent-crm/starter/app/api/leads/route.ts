import {
  createLead,
  deleteLead,
  findLead,
  isValidStatus,
  listLeads,
  updateLead,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: ?id= returns one lead (404 if absent); otherwise { leads } applying ?status=
  void req
  void listLeads
  void findLead
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a lead from { name, status?, propertyId? }; 400 if name blank
  void req
  void createLead
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= update { status?, propertyId? }; 400 invalid status; 404 if absent
  void req
  void findLead
  void updateLead
  void isValidStatus
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteLead
  return json({ error: 'not implemented' }, 501)
}
