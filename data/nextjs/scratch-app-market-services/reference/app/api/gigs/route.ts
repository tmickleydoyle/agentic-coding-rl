import { addReview, createGig, findGig, listGigs } from '../../../lib/store'
import type { Category } from '../../../lib/types'
import { CATEGORIES } from '../../../lib/types'

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
  const gigs = listGigs({ category: params.get('category') })
  return json({ gigs })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const category =
    typeof body.category === 'string' && (CATEGORIES as string[]).includes(body.category)
      ? (body.category as Category)
      : undefined
  const price = typeof body.price === 'number' ? body.price : undefined
  const gig = createGig({ title: title.trim(), category, price })
  return json(gig, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findGig(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const author = body.author
  if (typeof author !== 'string' || author.trim().length === 0) {
    return json({ error: 'author required' }, 400)
  }
  const rating = typeof body.rating === 'number' ? body.rating : 0
  const text = typeof body.text === 'string' ? body.text : undefined
  const gig = addReview(id, { author: author.trim(), rating, text })
  return json(gig)
}
