import { createFlag, deleteFlag, findFlag, listFlags, updateFlag } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { flags }; with ?env=, only enabled flags
  void req
  void listFlags
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a flag from { key, description? }; 400 if key blank
  void req
  void createFlag
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set/toggle env and/or clamp rollout; 404 if absent
  void req
  void findFlag
  void updateFlag
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteFlag
  return json({ error: 'not implemented' }, 501)
}
