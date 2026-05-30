import {
  createDeployment,
  deleteDeployment,
  findDeployment,
  listDeployments,
  updateDeployment,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { deployments } applying ?env= and ?status= filters
  void req
  void listDeployments
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a queued deployment from { env, service }; 400 if service blank
  void req
  void createDeployment
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set status / rollback; 404 if absent
  void req
  void findDeployment
  void updateDeployment
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteDeployment
  return json({ error: 'not implemented' }, 501)
}
