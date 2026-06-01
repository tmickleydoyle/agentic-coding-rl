import {
  createPart,
  findPart,
  findSeries,
  listParts,
  listSeries,
  updatePart,
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
  const seriesId = new URL(req.url).searchParams.get('seriesId')
  return json({ series: listSeries(), parts: listParts(seriesId) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const seriesId = typeof body.seriesId === 'string' ? body.seriesId : ''
  if (!findSeries(seriesId)) {
    return json({ error: 'series not found' }, 404)
  }
  const part = createPart({ seriesId, title: title.trim() })
  return json(part, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findPart(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { read?: boolean } = {}
  if (typeof body.read === 'boolean') patch.read = body.read
  else patch.read = !existing.read
  const updated = updatePart(id, patch)
  return json(updated)
}
