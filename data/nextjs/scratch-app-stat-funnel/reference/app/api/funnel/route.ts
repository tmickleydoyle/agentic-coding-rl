import { computeRows, createStep, deleteStep, listSteps } from '../../../lib/store'
import type { Segment } from '../../../lib/types'

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

const asSegment = (v: string | null): Segment =>
  v === 'mobile' || v === 'desktop' ? v : 'all'

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  if (params.get('rows') === '1') {
    const segment = asSegment(params.get('segment'))
    return json({ rows: computeRows(listSteps(), segment) })
  }
  return json({ steps: listSteps() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  if (typeof body.all !== 'number') {
    return json({ error: 'all count required' }, 400)
  }
  const num = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined)
  const step = createStep({
    name: name.trim(),
    all: body.all,
    mobile: num(body.mobile),
    desktop: num(body.desktop),
  })
  return json(step, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteStep(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
