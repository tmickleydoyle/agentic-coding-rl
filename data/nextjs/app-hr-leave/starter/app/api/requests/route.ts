import {
  createRequest,
  deleteRequest,
  findRequest,
  listRequests,
  updateRequest,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { requests } applying ?employeeId= and ?status= filters
  void req
  void listRequests
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a request from { employeeId, day, days?, reason? }; 400 if employeeId or
  // day missing
  void req
  void createRequest
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= update status; 404 if absent
  void req
  void findRequest
  void updateRequest
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteRequest
  return json({ error: 'not implemented' }, 501)
}
