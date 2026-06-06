import { getMovements, addMovement } from '../../../lib/store'

export async function GET() { return Response.json(getMovements()) }
export async function POST(req: Request) {
  const { itemId, type, quantity, notes } = await req.json()
  if (!itemId || !type || quantity == null) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addMovement({ itemId, type, quantity, notes: notes ?? '' }), { status: 201 })
}
