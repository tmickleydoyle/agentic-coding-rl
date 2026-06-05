import {
  createItem,
  deleteItem,
  findItem,
  listItems,
  updateItem,
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
  const items = listItems({
    aisle: params.get('aisle'),
    bought: params.get('bought'),
  })
  return json({ items })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const item = createItem({
    name: name.trim(),
    aisle: typeof body.aisle === 'string' ? body.aisle : undefined,
    qty: typeof body.qty === 'number' ? body.qty : undefined,
  })
  return json(item, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findItem(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { bought?: boolean; name?: string; aisle?: string; qty?: number } = {}
  if (typeof body.bought === 'boolean') patch.bought = body.bought
  else patch.bought = !existing.bought // no explicit bought => toggle
  if (typeof body.name === 'string') patch.name = body.name
  if (typeof body.aisle === 'string') patch.aisle = body.aisle
  if (typeof body.qty === 'number') patch.qty = body.qty
  const updated = updateItem(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteItem(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
