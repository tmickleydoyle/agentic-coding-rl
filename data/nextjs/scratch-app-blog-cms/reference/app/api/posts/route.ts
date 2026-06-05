import {
  createPost,
  deletePost,
  findPost,
  listPosts,
  updatePost,
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
  const posts = listPosts({
    status: params.get('status'),
    categoryId: params.get('categoryId'),
  })
  return json({ posts })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const post = createPost({
    title: title.trim(),
    body: typeof body.body === 'string' ? body.body : undefined,
    categoryId: typeof body.categoryId === 'string' ? body.categoryId : undefined,
    status: typeof body.status === 'string' ? body.status : undefined,
  })
  return json(post, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findPost(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { title?: string; body?: string; categoryId?: string; status?: string } = {}
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.body === 'string') patch.body = body.body
  if (typeof body.categoryId === 'string') patch.categoryId = body.categoryId
  if (typeof body.status === 'string') patch.status = body.status
  else patch.status = existing.status === 'published' ? 'draft' : 'published' // no explicit status => toggle
  const updated = updatePost(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deletePost(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
