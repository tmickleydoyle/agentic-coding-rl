import { getRequests, addRequest } from '../../../lib/store'

export async function GET() { return Response.json(getRequests()) }
export async function POST(req: Request) {
  const { staffId, startDate, endDate, reason } = await req.json()
  if (!staffId || !startDate || !endDate || !reason) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addRequest({ staffId, startDate, endDate, reason }), { status: 201 })
}
