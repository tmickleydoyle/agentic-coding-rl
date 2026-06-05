import {
  createArticle,
  deleteArticle,
  findArticle,
  listArticles,
  updateArticle,
} from '../../../lib/store'
import type { Category } from '../../../lib/types'

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
  const articles = listArticles({
    category: params.get('category'),
    q: params.get('q'),
  })
  return json({ articles })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const articleBody = typeof body.body === 'string' ? body.body : undefined
  const category = typeof body.category === 'string' ? (body.category as Category) : undefined
  const article = createArticle({ title: title.trim(), body: articleBody, category })
  return json(article, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findArticle(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { vote?: 'helpful' | 'notHelpful'; title?: string; body?: string; category?: Category } = {}
  if (body.vote === 'helpful' || body.vote === 'notHelpful') patch.vote = body.vote
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.body === 'string') patch.body = body.body
  if (typeof body.category === 'string') patch.category = body.category as Category
  const updated = updateArticle(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteArticle(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
