import { adjustProduct, createProduct, findProduct, listProducts } from '../../../lib/store'

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
  const products = listProducts({ low: params.get('low') })
  return json({ products })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const qty = body.qty
  if (typeof qty !== 'number' || Number.isNaN(qty) || qty < 0) {
    return json({ error: 'qty invalid' }, 400)
  }
  const reorderPoint = body.reorderPoint
  if (typeof reorderPoint !== 'number' || Number.isNaN(reorderPoint) || reorderPoint < 0) {
    return json({ error: 'reorderPoint invalid' }, 400)
  }
  const product = createProduct({ name: name.trim(), qty, reorderPoint })
  return json(product, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findProduct(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const delta = body.delta
  if (typeof delta !== 'number' || Number.isNaN(delta)) {
    return json({ error: 'delta invalid' }, 400)
  }
  const updated = adjustProduct(id, delta)
  return json(updated)
}
