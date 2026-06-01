import {
  cancelSubscription,
  createSubscription,
  deleteSubscription,
  findSubscription,
  listSubscriptions,
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
  const subscriptions = listSubscriptions({ active: params.get('active') })
  return json({ subscriptions })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const cost = body.cost
  if (typeof cost !== 'number' || Number.isNaN(cost) || cost <= 0) {
    return json({ error: 'cost must be positive' }, 400)
  }
  const cycle = body.cycle === 'annual' ? 'annual' : 'monthly'
  const nextRenewal = typeof body.nextRenewal === 'string' ? body.nextRenewal : ''
  if (nextRenewal.length === 0) {
    return json({ error: 'nextRenewal required' }, 400)
  }
  const sub = createSubscription({ name: name.trim(), cost, cycle, nextRenewal })
  return json(sub, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findSubscription(id)) return json({ error: 'not found' }, 404)
  const updated = cancelSubscription(id)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findSubscription(id)) return json({ error: 'not found' }, 404)
  deleteSubscription(id)
  return json({ ok: true })
}
