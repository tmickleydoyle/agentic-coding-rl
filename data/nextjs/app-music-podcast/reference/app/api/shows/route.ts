import { createShow, deleteShow, findShow, listShows, updateShow } from '../../../lib/store'

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
  const shows = listShows({
    category: params.get('category'),
    subscribed: params.get('subscribed'),
  })
  return json({ shows })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const category = typeof body.category === 'string' ? body.category : undefined
  const show = createShow({ title: title.trim(), category })
  return json(show, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findShow(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: {
    title?: string
    category?: string
    subscribed?: boolean
    subscribe?: boolean
  } = {}
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.category === 'string') patch.category = body.category
  if (typeof body.subscribed === 'boolean') patch.subscribed = body.subscribed
  if (typeof body.subscribe === 'boolean') patch.subscribe = body.subscribe
  const updated = updateShow(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteShow(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
