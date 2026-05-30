import {
  createApplication,
  findApplication,
  findUnit,
  isStatus,
  listApplications,
  setApplicationStatus,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { applications } applying ?unitId= and ?status= filters (AND)
  void req
  void listApplications
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a pending application from { unitId, applicant }; 400 if applicant blank,
  // 404 if unit unknown
  void req
  void createApplication
  void findUnit
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set status (approving marks unit occupied); 404 if absent, 400 if invalid
  void req
  void findApplication
  void isStatus
  void setApplicationStatus
  return json({ error: 'not implemented' }, 501)
}
