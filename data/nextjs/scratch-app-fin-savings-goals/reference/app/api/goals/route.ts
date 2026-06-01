import { createGoal, deleteGoal, findGoal, listGoals } from '../../../lib/store'

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

export async function GET(_req: Request): Promise<Response> {
  return json({ goals: listGoals() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const target = body.target
  if (typeof target !== 'number' || Number.isNaN(target) || target <= 0) {
    return json({ error: 'target must be positive' }, 400)
  }
  const monthlyContribution =
    typeof body.monthlyContribution === 'number' && body.monthlyContribution >= 0
      ? body.monthlyContribution
      : 0
  const goal = createGoal({ name: name.trim(), target, monthlyContribution })
  return json(goal, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findGoal(id)) return json({ error: 'not found' }, 404)
  deleteGoal(id)
  return json({ ok: true })
}
