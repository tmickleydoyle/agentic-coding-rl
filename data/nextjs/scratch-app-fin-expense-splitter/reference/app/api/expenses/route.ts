import {
  createExpense,
  deleteExpense,
  findExpense,
  findPerson,
  listExpenses,
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
  const expenses = listExpenses({ paidBy: params.get('paidBy') })
  return json({ expenses })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const description = body.description
  if (typeof description !== 'string' || description.trim().length === 0) {
    return json({ error: 'description required' }, 400)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return json({ error: 'amount must be positive' }, 400)
  }
  const paidBy = body.paidBy
  if (typeof paidBy !== 'string' || !findPerson(paidBy)) {
    return json({ error: 'invalid payer' }, 400)
  }
  const expense = createExpense({ description: description.trim(), amount, paidBy })
  return json(expense, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findExpense(id)) return json({ error: 'not found' }, 404)
  deleteExpense(id)
  return json({ ok: true })
}
