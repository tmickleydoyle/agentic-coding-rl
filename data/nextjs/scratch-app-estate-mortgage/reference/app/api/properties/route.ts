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
  const id = new URL(req.url).searchParams.get('id')
  if (id) {
    const property = findProperty(id)
    if (!property) return json({ error: 'not found' }, 404)
    return json(property)
  }
  return json({ properties: listProperties() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const address = body.address
  if (typeof address !== 'string' || address.trim().length === 0) {
    return json({ error: 'address required' }, 400)
  }
  const price = typeof body.price === 'number' ? body.price : undefined
  const property = createProperty({ address: address.trim(), price })
  return json(property, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteProperty(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
