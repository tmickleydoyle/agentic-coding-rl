import { createListing, deleteListing, listListings } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { listings } applying ?category= and ?maxPrice= filters
  void req
  void listListings
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a listing from { title, category?, price?, seller?, description? };
  // 400 if title blank
  void req
  void createListing
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteListing
  return json({ error: 'not implemented' }, 501)
}
