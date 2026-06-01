import { createPot, deletePot, findPot, listPots, updatePot } from '../../../lib/store'

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
  return json({ pots: listPots() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const goal = typeof body.goal === 'number' && body.goal >= 0 ? body.goal : 0
  const pot = createPot({ name: name.trim(), goal })
  return json(pot, 201)
}

export async function PATCH(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const body = await readBody(req)
  const patch: { balance?: number; goal?: number } = {}
  if (typeof body.balance === 'number') patch.balance = body.balance
  if (typeof body.goal === 'number') patch.goal = body.goal
  const pot = updatePot(id, patch)
  if (!pot) return json({ error: 'not found' }, 404)
  return json(pot)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findPot(id)) return json({ error: 'not found' }, 404)
  deletePot(id)
  return json({ ok: true })
}
