import { createSupplier, listSuppliers } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { suppliers } applying ?category= filter
  void req
  void listSuppliers
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a supplier from { name, leadTimeDays, ... }; 400 if name blank or lead invalid
  void req
  void createSupplier
  return json({ error: 'not implemented' }, 501)
}
