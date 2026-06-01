import { clipsByCategory, findClip, likeClip, listClips } from '../../../lib/store'

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
    const clip = findClip(id)
    if (!clip) return json({ error: 'not found' }, 404)
    return json({ clip })
  }
  const category = params.get('category')
  if (category) {
    return json({ clips: clipsByCategory(category) })
  }
  return json({ clips: listClips() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const id = body.id
  if (typeof id !== 'string' || id.trim().length === 0) {
    return json({ error: 'id required' }, 400)
  }
  const clip = likeClip(id)
  if (!clip) return json({ error: 'not found' }, 404)
  return json({ clip })
}
