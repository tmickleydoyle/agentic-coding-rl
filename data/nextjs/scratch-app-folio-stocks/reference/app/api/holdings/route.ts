import { createHolding, deleteHolding, findHolding, listHoldings } from '../../../lib/store'

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
  const shares = body.shares
  if (typeof shares !== 'number' || Number.isNaN(shares) || shares <= 0) {
    return json({ error: 'shares must be positive' }, 400)
  }
  const costBasis = body.costBasis
  if (typeof costBasis !== 'number' || Number.isNaN(costBasis) || costBasis <= 0) {
    return json({ error: 'costBasis must be positive' }, 400)
  }
  const name = typeof body.name === 'string' && body.name.trim().length > 0 ? body.name.trim() : undefined
  const price =
    typeof body.price === 'number' && !Number.isNaN(body.price) && body.price > 0
      ? body.price
      : undefined
  const holding = createHolding({ symbol: symbol.trim().toUpperCase(), name, shares, costBasis, price })
  return json(holding, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findHolding(id)) return json({ error: 'not found' }, 404)
  deleteHolding(id)
  return json({ ok: true })
}
