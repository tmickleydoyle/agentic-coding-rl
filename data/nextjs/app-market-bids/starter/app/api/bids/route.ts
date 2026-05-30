import { listBids, placeBid } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { bids } applying ?auctionId= filter
  void req
  void listBids
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: place a bid from { auctionId, bidder, amount }; 201 on success, 404 unknown
  // auction, 409 closed auction, 400 bid too low.
  void req
  void placeBid
  return json({ error: 'not implemented' }, 501)
}
