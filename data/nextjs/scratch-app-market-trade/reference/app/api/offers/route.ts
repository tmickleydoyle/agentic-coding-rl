import { createOffer, findOffer, listOffers, setOfferStatus } from '../../../lib/store'
import type { Status } from '../../../lib/types'
import { STATUSES } from '../../../lib/types'

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
  const offers = listOffers({
    itemId: params.get('itemId'),
    status: params.get('status'),
  })
  return json({ offers })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const give = body.give
  if (typeof give !== 'string' || give.trim().length === 0) {
    return json({ error: 'give required' }, 400)
  }
  const itemId = typeof body.itemId === 'string' ? body.itemId : ''
  const offeredBy = typeof body.offeredBy === 'string' ? body.offeredBy : undefined
  const offer = createOffer({ itemId, offeredBy, give: give.trim() })
  return json(offer, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findOffer(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const status = body.status
  if (typeof status !== 'string' || !(STATUSES as string[]).includes(status)) {
    return json({ error: 'invalid status' }, 400)
  }
  const offer = setOfferStatus(id, status as Status)
  return json(offer)
}
