import {
  createBuild,
  deleteBuild,
  findBuild,
  listBuilds,
  updateBuild,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { builds } applying ?status= and ?pipelineId= filters
  void req
  void listBuilds
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a running build from { pipelineId, durationSec? }; 400 if pipelineId blank
  void req
  void createBuild
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set status or retry (running); 404 if absent
  void req
  void findBuild
  void updateBuild
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteBuild
  return json({ error: 'not implemented' }, 501)
}
