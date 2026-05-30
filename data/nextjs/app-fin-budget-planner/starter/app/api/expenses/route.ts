import {
  createExpense,
  deleteExpense,
  findCategory,
  findExpense,
  listExpenses,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { expenses } applying ?categoryId= filter
  void req
  void listExpenses
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an expense from { categoryId, amount, note? }; 400 invalid category or
  // non-positive amount
  void req
  void createExpense
  void findCategory
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteExpense
  void findExpense
  return json({ error: 'not implemented' }, 501)
}
