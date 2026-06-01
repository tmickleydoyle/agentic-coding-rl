import { createSupplier, listSuppliers } from '../../../lib/store'

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
  const suppliers = listSuppliers({ category: params.get('category') })
  return json({ suppliers })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const leadTimeDays = body.leadTimeDays
  if (typeof leadTimeDays !== 'number' || Number.isNaN(leadTimeDays) || leadTimeDays < 0) {
    return json({ error: 'leadTimeDays required' }, 400)
  }
  const category = typeof body.category === 'string' && body.category.trim().length > 0 ? body.category.trim() : 'Uncategorized'
  const rating = typeof body.rating === 'number' ? body.rating : 0
  const supplier = createSupplier({ name: name.trim(), category, leadTimeDays, rating })
  return json(supplier, 201)
}
