import {
  convertLead,
  createLead,
  deleteLead,
  findLead,
  isStatus,
  listLeads,
  statusCounts,
  updateLead,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: { leads } with ?status=/?minScore=; ?counts=true -> { counts }
  void req
  void listLeads
  void statusCounts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a lead from { name, source?, score? }; 400 if name blank
  void req
  void createLead
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch status/score; ?action=convert -> { lead, deal }; 404 if absent
  void req
  void findLead
  void updateLead
  void convertLead
  void isStatus
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteLead
  return json({ error: 'not implemented' }, 501)
}
