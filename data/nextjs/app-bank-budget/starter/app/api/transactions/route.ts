import {
  createTransaction,
  deleteTransaction,
  findCategory,
  findTransaction,
  listTransactions,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { transactions } applying ?categoryId= filter
  void req
  void listTransactions
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a transaction from { categoryId, description?, amount }; 400 invalid category
  // or non-positive amount
  void req
  void createTransaction
  void findCategory
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteTransaction
  void findTransaction
  return json({ error: 'not implemented' }, 501)
}
