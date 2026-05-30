import { findKpi, listKpis, setTarget } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: ?id= returns one kpi (404 if absent); otherwise { kpis }
  void req
  void findKpi
  void listKpis
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= body { target } updates the target; 400 if non-number, 404 if absent
  void req
  void setTarget
  return json({ error: 'not implemented' }, 501)
}
