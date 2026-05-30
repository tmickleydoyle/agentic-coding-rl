import { createTicker, deleteTicker, findTicker, listTickers } from '../../../lib/store'
import type { Direction } from '../../../lib/types'

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
  const alertsOnly = new URL(req.url).searchParams.get('alerts') === 'true'
  return json({ tickers: listTickers({ alertsOnly }) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const symbol = body.symbol
  if (typeof symbol !== 'string' || symbol.trim().length === 0) {
    return json({ error: 'symbol required' }, 400)
  }
  const price = body.price
  if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) {
    return json({ error: 'price must be positive' }, 400)
  }
  const targetPrice = body.targetPrice
  if (typeof targetPrice !== 'number' || Number.isNaN(targetPrice) || targetPrice <= 0) {
    return json({ error: 'targetPrice must be positive' }, 400)
  }
  const name = typeof body.name === 'string' && body.name.trim().length > 0 ? body.name.trim() : undefined
  const direction: Direction = body.direction === 'below' ? 'below' : 'above'
  const ticker = createTicker({ symbol: symbol.trim().toUpperCase(), name, price, targetPrice, direction })
  return json(ticker, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findTicker(id)) return json({ error: 'not found' }, 404)
  deleteTicker(id)
  return json({ ok: true })
}
