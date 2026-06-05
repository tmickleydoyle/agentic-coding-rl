import { createProduct, deleteProduct, listProducts } from '../../../lib/store'

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
  const products = listProducts({
    category: params.get('category'),
    maxPrice: params.get('maxPrice'),
  })
  return json({ products })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const price = body.price
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    return json({ error: 'price invalid' }, 400)
  }
  const category = typeof body.category === 'string' ? body.category : undefined
  const product = createProduct({ name: name.trim(), category, price })
  return json(product, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteProduct(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
