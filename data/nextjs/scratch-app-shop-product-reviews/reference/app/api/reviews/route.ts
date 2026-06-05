import { createReview, deleteReview, listReviews } from '../../../lib/store'

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
  const reviews = listReviews({
    productId: params.get('productId'),
    sort: params.get('sort'),
  })
  return json({ reviews })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const rating = body.rating
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: 'rating 1-5 required' }, 400)
  }
  const text = body.text
  if (typeof text !== 'string' || text.trim().length === 0) {
    return json({ error: 'text required' }, 400)
  }
  const productId = typeof body.productId === 'string' ? body.productId : 'p1'
  const review = createReview({ productId, rating, text: text.trim() })
  return json(review, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteReview(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
