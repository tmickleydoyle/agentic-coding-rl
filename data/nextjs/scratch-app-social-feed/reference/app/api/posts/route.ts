import {
  createPost,
  deletePost,
  findPost,
  listPosts,
  setLiked,
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
  const posts = listPosts({ authorId: params.get('authorId') })
  return json({ posts })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const authorId = body.authorId
  if (typeof authorId !== 'string' || authorId.trim().length === 0) {
    return json({ error: 'authorId required' }, 400)
  }
  const text = body.text
  if (typeof text !== 'string' || text.trim().length === 0) {
    return json({ error: 'text required' }, 400)
  }
  const post = createPost({ authorId, text: text.trim() })
  return json(post, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findPost(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const liked = typeof body.liked === 'boolean' ? body.liked : undefined
  const updated = setLiked(id, liked)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deletePost(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
