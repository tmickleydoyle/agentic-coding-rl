import { createAuction, listAuctions } from '../../../lib/store'

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
  const auctions = listAuctions({ open: params.get('open') })
  return json({ auctions })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const hoursLeft = typeof body.hoursLeft === 'number' ? body.hoursLeft : undefined
  const startBid = typeof body.startBid === 'number' ? body.startBid : undefined
  const auction = createAuction({ title: title.trim(), hoursLeft, startBid })
  return json(auction, 201)
}
