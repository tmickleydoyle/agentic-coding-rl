import { findUnit, listUnits, occupancyRate, updateUnit } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { units, occupancyRate } applying optional ?occupied= filter
  void req
  void listUnits
  void occupancyRate
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= toggle/set occupied; 404 if absent
  void req
  void findUnit
  void updateUnit
  return json({ error: 'not implemented' }, 501)
}
