import { createCoin, deleteCoin, findCoin, listCoins } from '../../../lib/store'

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
  return json({ coins: listCoins() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const symbol = body.symbol
  if (typeof symbol !== 'string' || symbol.trim().length === 0) {
    return json({ error: 'symbol required' }, 400)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return json({ error: 'amount must be positive' }, 400)
  }
  const price = body.price
  if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) {
    return json({ error: 'price must be positive' }, 400)
  }
  const name = typeof body.name === 'string' && body.name.trim().length > 0 ? body.name.trim() : undefined
  const change24h =
    typeof body.change24h === 'number' && !Number.isNaN(body.change24h) ? body.change24h : undefined
  const coin = createCoin({ symbol: symbol.trim().toUpperCase(), name, amount, price, change24h })
  return json(coin, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findCoin(id)) return json({ error: 'not found' }, 404)
  deleteCoin(id)
  return json({ ok: true })
}
