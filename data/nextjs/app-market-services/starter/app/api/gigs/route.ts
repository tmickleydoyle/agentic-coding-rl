import { addReview, createGig, findGig, listGigs } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { gigs } applying ?category= filter
  void req
  void listGigs
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a gig from { title, category?, price? }; 400 if title blank
  void req
  void createGig
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= add a review from { author, rating, text? }; 404 unknown gig, 400 blank author
  void req
  void findGig
  void addReview
  return json({ error: 'not implemented' }, 501)
}
