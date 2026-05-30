import {
  createInvoice,
  deleteInvoice,
  findInvoice,
  listInvoices,
  updateInvoice,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { invoices } applying ?status= and ?clientId= filters
  void req
  void listInvoices
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an invoice from { clientId, amount, dueDate, status? }; 400 if amount <= 0
  void req
  void createInvoice
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set status / mark paid; 404 if absent
  void req
  void findInvoice
  void updateInvoice
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteInvoice
  return json({ error: 'not implemented' }, 501)
}
