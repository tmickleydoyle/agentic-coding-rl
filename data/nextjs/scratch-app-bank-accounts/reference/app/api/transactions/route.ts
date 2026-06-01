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

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const transactions = listTransactions({ accountId: params.get('accountId') })
  return json({ transactions })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const accountId = body.accountId
  if (typeof accountId !== 'string' || !findAccount(accountId)) {
    return json({ error: 'invalid account' }, 400)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount === 0) {
    return json({ error: 'amount required' }, 400)
  }
  const description = typeof body.description === 'string' ? body.description : ''
  const txn = createTransaction({ accountId, description, amount })
  return json(txn, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findTransaction(id)) return json({ error: 'not found' }, 404)
  deleteTransaction(id)
  return json({ ok: true })
}
