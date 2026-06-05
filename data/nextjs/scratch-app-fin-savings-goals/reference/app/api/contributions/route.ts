import { createContribution, findGoal, listContributions } from '../../../lib/store'

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
  const contributions = listContributions({ goalId: params.get('goalId') })
  return json({ contributions })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const goalId = body.goalId
  if (typeof goalId !== 'string' || !findGoal(goalId)) {
    return json({ error: 'invalid goal' }, 400)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return json({ error: 'amount must be positive' }, 400)
  }
  const contribution = createContribution({ goalId, amount })
  return json(contribution, 201)
}
