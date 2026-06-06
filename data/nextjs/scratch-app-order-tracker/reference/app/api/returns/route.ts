import { getReturns, addReturn } from '../../../lib/store'

export async function GET() { return Response.json(getReturns()) }
export async function POST(req: Request) {
  const { orderId, reason } = await req.json()
  if (!orderId || !reason) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addReturn({ orderId, reason }), { status: 201 })
}
