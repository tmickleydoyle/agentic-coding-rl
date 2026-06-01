import { createBin, findBin, listBins, moveBetween } from '../../../lib/store'

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
  const bins = listBins({ available: params.get('available') })
  return json({ bins })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const code = body.code
  if (typeof code !== 'string' || code.trim().length === 0) {
    return json({ error: 'code required' }, 400)
  }
  const capacity = body.capacity
  if (typeof capacity !== 'number' || Number.isNaN(capacity) || capacity <= 0) {
    return json({ error: 'capacity invalid' }, 400)
  }
  const bin = createBin({ code: code.trim(), capacity })
  return json(bin, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const body = await readBody(req)
  const from = body.from
  const to = body.to
  const name = body.name
  const qty = body.qty
  if (typeof from !== 'string' || typeof to !== 'string' || typeof name !== 'string') {
    return json({ error: 'move invalid' }, 400)
  }
  if (typeof qty !== 'number' || Number.isNaN(qty) || qty <= 0) {
    return json({ error: 'qty invalid' }, 400)
  }
  if (!findBin(from) || !findBin(to)) {
    return json({ error: 'not found' }, 404)
  }
  const result = moveBetween(from, to, name, qty)
  if (!result.ok) return json({ error: result.error }, 409)
  return json({ bins: listBins() })
}
