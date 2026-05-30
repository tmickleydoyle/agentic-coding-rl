import {
  createThread,
  deleteThread,
  findThread,
  listThreads,
  upvoteThread,
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
  const threads = listThreads({
    categoryId: params.get('categoryId'),
    sort: params.get('sort'),
  })
  return json({ threads })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const categoryId = typeof body.categoryId === 'string' ? body.categoryId : undefined
  const thread = createThread({ title: title.trim(), categoryId })
  return json(thread, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findThread(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const updated = upvoteThread(id)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteThread(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
