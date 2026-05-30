import {
  channelVideos,
  findVideo,
  listVideos,
  recordView,
  sortVideos,
} from '../../../lib/store'
import type { SortKey } from '../../../lib/types'

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
    const video = findVideo(id)
    if (!video) return json({ error: 'not found' }, 404)
    return json({ video })
  }
  const channelId = params.get('channelId')
  if (channelId) {
    return json({ videos: channelVideos(channelId) })
  }
  const sort = params.get('sort')
  if (sort === 'views' || sort === 'recent') {
    return json({ videos: sortVideos(sort as SortKey) })
  }
  return json({ videos: listVideos() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const id = body.id
  if (typeof id !== 'string' || id.trim().length === 0) {
    return json({ error: 'id required' }, 400)
  }
  const video = recordView(id)
  if (!video) return json({ error: 'not found' }, 404)
  return json({ video })
}
