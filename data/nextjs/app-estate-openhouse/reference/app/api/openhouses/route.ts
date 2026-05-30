import {
  addFeedback,
  findHouse,
  listHouses,
  registerVisitor,
} from '../../../lib/store'

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
  const houseId = new URL(req.url).searchParams.get('houseId')
  return json({ houses: listHouses(houseId) })
}

export async function POST(req: Request): Promise<Response> {
  const houseId = new URL(req.url).searchParams.get('houseId') ?? ''
  if (!findHouse(houseId)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const house = registerVisitor(houseId, name.trim())
  return json(house, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const houseId = new URL(req.url).searchParams.get('houseId') ?? ''
  if (!findHouse(houseId)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const visitor = body.visitor
  if (typeof visitor !== 'string' || visitor.trim().length === 0) {
    return json({ error: 'visitor required' }, 400)
  }
  const rating = typeof body.rating === 'number' && Number.isFinite(body.rating) ? body.rating : 0
  const note = typeof body.note === 'string' ? body.note : ''
  const house = addFeedback(houseId, { visitor: visitor.trim(), rating, note })
  return json(house)
}
