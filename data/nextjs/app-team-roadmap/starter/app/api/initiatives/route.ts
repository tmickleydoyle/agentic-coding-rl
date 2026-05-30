import {
  createInitiative,
  deleteInitiative,
  findInitiative,
  listInitiatives,
  updateInitiative,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { initiatives } applying ?quarterId= and ?status= filters
  void req
  void listInitiatives
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an initiative from { title, quarterId }; 400 if title blank
  void req
  void createInitiative
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= update quarterId/status; 404 if absent
  void req
  void findInitiative
  void updateInitiative
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteInitiative
  return json({ error: 'not implemented' }, 501)
}
