import { getShipments, addShipment } from '../../../lib/store'

export async function GET() { return Response.json(getShipments()) }
export async function POST(req: Request) {
  const { orderId, carrier, trackingNumber, estimatedDelivery } = await req.json()
  if (!orderId || !carrier || !trackingNumber || !estimatedDelivery) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addShipment({ orderId, carrier, trackingNumber, estimatedDelivery }), { status: 201 })
}
