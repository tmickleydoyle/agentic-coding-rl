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
  const expenses = listExpenses({ categoryId: params.get('categoryId') })
  return json({ expenses })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const categoryId = body.categoryId
  if (typeof categoryId !== 'string' || !findCategory(categoryId)) {
    return json({ error: 'invalid category' }, 400)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return json({ error: 'amount must be positive' }, 400)
  }
  const note = typeof body.note === 'string' ? body.note : ''
  const expense = createExpense({ categoryId, amount, note })
  return json(expense, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findExpense(id)) return json({ error: 'not found' }, 404)
  deleteExpense(id)
  return json({ ok: true })
}
