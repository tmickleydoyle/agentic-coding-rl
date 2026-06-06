import { getGoals, addGoal, getBudgetEntries, addBudgetEntry } from '../../../lib/store'

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  if (url.pathname.endsWith('/budget')) {
    return Response.json({ entries: getBudgetEntries() })
  }
  return Response.json({ goals: getGoals() })
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const body = await req.json()

  if (url.pathname.endsWith('/budget')) {
    const { category, amount, month } = body
    if (!category || amount == null || !month) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }
    const entry = addBudgetEntry({ category, amount: Number(amount), month })
    return Response.json(entry, { status: 201 })
  }

  const { name, targetAmount, currentAmount, deadline, category } = body
  if (!name || targetAmount == null || deadline == null || !category) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }
  const goal = addGoal({ name, targetAmount: Number(targetAmount), currentAmount: Number(currentAmount ?? 0), deadline, category })
  return Response.json(goal, { status: 201 })
}
