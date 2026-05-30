import {
  createHolding,
  deleteHolding,
  findHolding,
  listHoldings,
  updateTarget,
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
  return json({ holdings: listHoldings() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const symbol = body.symbol
  if (typeof symbol !== 'string' || symbol.trim().length === 0) {
    return json({ error: 'symbol required' }, 400)
  }
  const value = body.value
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return json({ error: 'value must be positive' }, 400)
  }
  const targetPercent = body.targetPercent
  if (typeof targetPercent !== 'number' || Number.isNaN(targetPercent) || targetPercent < 0) {
    return json({ error: 'targetPercent must be non-negative' }, 400)
  }
  const name = typeof body.name === 'string' && body.name.trim().length > 0 ? body.name.trim() : undefined
  const holding = createHolding({ symbol: symbol.trim().toUpperCase(), name, value, targetPercent })
  return json(holding, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findHolding(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const targetPercent = body.targetPercent
  if (typeof targetPercent !== 'number' || Number.isNaN(targetPercent) || targetPercent < 0) {
    return json({ error: 'targetPercent must be non-negative' }, 400)
  }
  const holding = updateTarget(id, targetPercent)
  return json(holding)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findHolding(id)) return json({ error: 'not found' }, 404)
  deleteHolding(id)
  return json({ ok: true })
}
