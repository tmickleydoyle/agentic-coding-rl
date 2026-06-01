import {
  createComment,
  deleteComment,
  findComment,
  listComments,
  updateComment,
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
  const comments = listComments({
    status: params.get('status'),
    postId: params.get('postId'),
  })
  return json({ comments })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const postId = body.postId
  const author = body.author
  if (typeof postId !== 'string' || postId.trim().length === 0) {
    return json({ error: 'postId required' }, 400)
  }
  if (typeof author !== 'string' || author.trim().length === 0) {
    return json({ error: 'author required' }, 400)
  }
  const comment = createComment({
    postId,
    author: author.trim(),
    body: typeof body.body === 'string' ? body.body : undefined,
  })
  return json(comment, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findComment(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (typeof body.status !== 'string') {
    return json({ error: 'status required' }, 400)
  }
  if (body.status !== 'pending' && body.status !== 'approved' && body.status !== 'spam') {
    return json({ error: 'invalid status' }, 400)
  }
  const updated = updateComment(id, { status: body.status })
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteComment(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
