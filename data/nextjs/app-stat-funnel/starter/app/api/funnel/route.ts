import { computeRows, createStep, deleteStep, listSteps } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { steps } sorted by order; with ?rows=1 return { rows } for ?segment=.
  void req
  void listSteps
  void computeRows
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a step from { name, all, mobile?, desktop? }; 400 if name blank or all
  // not a number.
  void req
  void createStep
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteStep
  return json({ error: 'not implemented' }, 501)
}
