import { createListing, deleteListing, listListings } from '../../../lib/store'
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
  const listings = listListings({
    category: params.get('category'),
    maxPrice: params.get('maxPrice'),
  })
  return json({ listings })
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
  const seller = typeof body.seller === 'string' ? body.seller : undefined
  const description = typeof body.description === 'string' ? body.description : undefined
  const listing = createListing({ title: title.trim(), category, price, seller, description })
  return json(listing, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteListing(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
