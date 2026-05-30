import {
  createTransaction,
  deleteTransaction,
  findAccount,
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
  // TODO: return { transactions } applying ?accountId= filter
  void req
  void listTransactions
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a transaction from { accountId, description?, amount }; 400 invalid account
  // or zero amount; adjust the account balance
  void req
  void createTransaction
  void findAccount
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete and reverse the balance effect; 404 if absent
  void req
  void deleteTransaction
  void findTransaction
  return json({ error: 'not implemented' }, 501)
}
