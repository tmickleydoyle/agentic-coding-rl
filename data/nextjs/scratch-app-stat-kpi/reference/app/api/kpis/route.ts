import { findKpi, listKpis, setTarget } from '../../../lib/store'

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
    const kpi = findKpi(id)
    if (!kpi) return json({ error: 'not found' }, 404)
    return json(kpi)
  }
  return json({ kpis: listKpis() })
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const body = await readBody(req)
  const target = body.target
  if (typeof target !== 'number' || Number.isNaN(target)) {
    return json({ error: 'target required' }, 400)
  }
  const updated = setTarget(id, target)
  if (!updated) return json({ error: 'not found' }, 404)
  return json(updated)
}
