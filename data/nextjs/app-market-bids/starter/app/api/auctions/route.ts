import { createAuction, listAuctions } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { auctions } applying ?open=true filter
  void req
  void listAuctions
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an auction from { title, hoursLeft?, startBid? }; 400 if title blank
  void req
  void createAuction
  return json({ error: 'not implemented' }, 501)
}
