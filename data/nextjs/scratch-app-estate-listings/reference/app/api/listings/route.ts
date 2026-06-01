import {
  createProperty,
  deleteProperty,
  findProperty,
  listProperties,
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

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id')
  if (id) {
    const property = findProperty(id)
    if (!property) return json({ error: 'not found' }, 404)
    return json(property)
  }
  const properties = listProperties({
    type: params.get('type'),
    minBeds: params.get('minBeds'),
    maxPrice: params.get('maxPrice'),
  })
  return json({ properties })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const address = body.address
  if (typeof address !== 'string' || address.trim().length === 0) {
    return json({ error: 'address required' }, 400)
  }
  const type = typeof body.type === 'string' ? body.type : undefined
  const price = typeof body.price === 'number' ? body.price : undefined
  const beds = typeof body.beds === 'number' ? body.beds : undefined
  const baths = typeof body.baths === 'number' ? body.baths : undefined
  const property = createProperty({ address: address.trim(), type, price, beds, baths })
  return json(property, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteProperty(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
