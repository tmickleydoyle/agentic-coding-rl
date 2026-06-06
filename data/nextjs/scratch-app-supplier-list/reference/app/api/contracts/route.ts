import { getContracts, addContract } from '../../../lib/store'

export async function GET() { return Response.json(getContracts()) }
export async function POST(req: Request) {
  const { supplierId, startDate, endDate, value } = await req.json()
  if (!supplierId || !startDate || !endDate || value == null) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addContract({ supplierId, startDate, endDate, value }), { status: 201 })
}
