import {
  createCandidate,
  deleteCandidate,
  findCandidate,
  listCandidates,
  updateCandidate,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { candidates } applying ?jobId= and ?stage= filters
  void req
  void listCandidates
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a candidate from { name, jobId?, stage? }; 400 if name blank
  void req
  void createCandidate
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= update stage/jobId; 404 if absent
  void req
  void findCandidate
  void updateCandidate
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteCandidate
  return json({ error: 'not implemented' }, 501)
}
