import { createPage, deletePage, findPage, listPages, updatePage } from '../../../lib/store'

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
  const minViewsRaw = params.get('minViews')
  const minViews = minViewsRaw !== null && minViewsRaw.trim() !== '' ? Number(minViewsRaw) : null
  const pages = listPages({
    range: params.get('range'),
    minViews: typeof minViews === 'number' && !Number.isNaN(minViews) ? minViews : null,
  })
  return json({ pages })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const path = body.path
  if (typeof path !== 'string' || path.trim().length === 0) {
    return json({ error: 'path required' }, 400)
  }
  const num = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined)
  const page = createPage({
    path: path.trim(),
    views: num(body.views),
    sessions: num(body.sessions),
    bounceRate: num(body.bounceRate),
  })
  return json(page, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findPage(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { views?: number; sessions?: number; bounceRate?: number } = {}
  if (typeof body.views === 'number') patch.views = body.views
  if (typeof body.sessions === 'number') patch.sessions = body.sessions
  if (typeof body.bounceRate === 'number') patch.bounceRate = body.bounceRate
  const updated = updatePage(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deletePage(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
