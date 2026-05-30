import { createBill, listBills, updateBill } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { bills } applying ?unpaid=true filter
  void req
  void listBills
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a bill from { name, amount, dueDay, autopay? }; 400 on blank name,
  // non-positive amount, or invalid due day
  void req
  void createBill
  return json({ error: 'not implemented' }, 501)
}

export async function PATCH(req: Request): Promise<Response> {
  // TODO: ?id= update { paid?, autopay? }; 404 if absent
  void req
  void updateBill
  return json({ error: 'not implemented' }, 501)
}
