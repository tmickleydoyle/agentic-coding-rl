import { getOrders, addOrder } from '../../../lib/store'

export async function GET() { return Response.json(getOrders()) }
export async function POST(req: Request) {
  const { orderNumber, date, total } = await req.json()
  if (!orderNumber || !date || total == null) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addOrder({ orderNumber, date, total }), { status: 201 })
}
