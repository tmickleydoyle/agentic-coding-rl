import { createFeedback, isSentiment, isStatus, listFeedback, setStatus } from '../../../lib/store'

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
  const feedback = listFeedback({
    category: params.get('category'),
    status: params.get('status'),
  })
  return json({ feedback })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const author = body.author
  if (typeof author !== 'string' || author.trim().length === 0) {
    return json({ error: 'author required' }, 400)
  }
  const message = body.message
  if (typeof message !== 'string' || message.trim().length === 0) {
    return json({ error: 'message required' }, 400)
  }
  const category = typeof body.category === 'string' && body.category.trim().length > 0 ? body.category.trim() : 'General'
  const sentiment = isSentiment(body.sentiment) ? body.sentiment : 'neutral'
  const item = createFeedback({ author: author.trim(), message: message.trim(), category, sentiment })
  return json(item, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const body = await readBody(req)
  if (!isStatus(body.status)) {
    return json({ error: 'invalid status' }, 400)
  }
  const updated = setStatus(id, body.status)
  if (!updated) return json({ error: 'not found' }, 404)
  return json(updated)
}
