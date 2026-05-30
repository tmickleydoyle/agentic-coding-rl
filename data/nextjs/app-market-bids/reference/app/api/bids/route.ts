import { listBids, placeBid } from '../../../lib/store'

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
  const bids = listBids({ auctionId: params.get('auctionId') })
  return json({ bids })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const auctionId = typeof body.auctionId === 'string' ? body.auctionId : ''
  const bidder = typeof body.bidder === 'string' ? body.bidder : 'unknown'
  const amount = typeof body.amount === 'number' ? body.amount : NaN
  const result = placeBid({ auctionId, bidder, amount })
  if (result.ok) return json(result.bid, 201)
  if (result.reason === 'not found') return json({ error: 'not found' }, 404)
  if (result.reason === 'auction closed') return json({ error: 'auction closed' }, 409)
  return json({ error: 'bid too low' }, 400)
}
