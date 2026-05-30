import { createOffer, findOffer, listOffers, setOfferStatus } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { offers } applying ?itemId= and ?status= filters
  void req
  void listOffers
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an offer from { itemId, offeredBy?, give }; 400 if give blank
  void req
  void createOffer
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set status from { status }; 404 unknown id, 400 invalid status
  void req
  void findOffer
  void setOfferStatus
  return json({ error: 'not implemented' }, 501)
}
