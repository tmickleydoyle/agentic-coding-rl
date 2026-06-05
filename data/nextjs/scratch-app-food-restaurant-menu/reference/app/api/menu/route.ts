import { createDish, deleteDish, listDishes } from '../../../lib/store'

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
  const dishes = listDishes({
    category: params.get('category'),
    vegetarian: params.get('vegetarian'),
  })
  return json({ dishes })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const dish = createDish({
    name: name.trim(),
    category: typeof body.category === 'string' ? body.category : undefined,
    price: typeof body.price === 'number' ? body.price : undefined,
    vegetarian: typeof body.vegetarian === 'boolean' ? body.vegetarian : undefined,
  })
  return json(dish, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteDish(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
