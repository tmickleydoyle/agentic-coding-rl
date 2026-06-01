import {
  addGoal,
  deleteGoal,
  listGoals,
  toggleMilestone,
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

export async function GET(_req: Request): Promise<Response> {
  return json({ goals: listGoals() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  const targetDate = body.targetDate
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  if (typeof targetDate !== 'string' || targetDate.trim().length === 0) {
    return json({ error: 'targetDate required' }, 400)
  }
  const goal = addGoal({ name: name.trim(), targetDate: targetDate.trim() })
  return json(goal, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const body = await readBody(req)
  const goalId = typeof body.goalId === 'string' ? body.goalId : ''
  const milestoneId = typeof body.milestoneId === 'string' ? body.milestoneId : ''
  const result = toggleMilestone(goalId, milestoneId)
  if (result.kind === 'no-goal') return json({ error: 'goal not found' }, 404)
  if (result.kind === 'no-milestone') return json({ error: 'milestone not found' }, 404)
  return json(result.goal)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteGoal(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
