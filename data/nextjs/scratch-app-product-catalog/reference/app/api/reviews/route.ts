import { getReviews, addReview } from '../../../lib/store'

export async function GET() { return Response.json(getReviews()) }
export async function POST(req: Request) {
  const { productId, rating, comment, reviewer } = await req.json()
  if (!productId || !rating || !comment || !reviewer) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addReview({ productId, rating, comment, reviewer }), { status: 201 })
}
