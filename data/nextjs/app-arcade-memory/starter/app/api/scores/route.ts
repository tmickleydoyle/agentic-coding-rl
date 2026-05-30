import { bestOf, createRun, deleteRun, listRuns } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(): Promise<Response> {
  // TODO: return { runs, best }
  void bestOf
  void listRuns
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: record a run; 400 bad moves
  void req
  void createRun
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteRun
  return json({ error: 'not implemented' }, 501)
}
