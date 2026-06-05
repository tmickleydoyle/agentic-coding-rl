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

export async function GET(req: Request): Promise<Response> {
  const monthParam = new URL(req.url).searchParams.get('payMonth')
  const payMonth = monthParam == null ? null : Number(monthParam)
  return json({ holdings: listHoldings({ payMonth }) })
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
  const dividendPerShare = body.dividendPerShare
  if (typeof dividendPerShare !== 'number' || Number.isNaN(dividendPerShare) || dividendPerShare <= 0) {
    return json({ error: 'dividendPerShare must be positive' }, 400)
  }
  const name = typeof body.name === 'string' && body.name.trim().length > 0 ? body.name.trim() : undefined
  const payMonth =
    typeof body.payMonth === 'number' && body.payMonth >= 1 && body.payMonth <= 12
      ? body.payMonth
      : undefined
  const holding = createHolding({ symbol: symbol.trim().toUpperCase(), name, shares, dividendPerShare, payMonth })
  return json(holding, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findHolding(id)) return json({ error: 'not found' }, 404)
  deleteHolding(id)
  return json({ ok: true })
}
