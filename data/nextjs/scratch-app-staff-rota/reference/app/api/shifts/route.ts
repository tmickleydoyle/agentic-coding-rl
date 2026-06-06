import { getShifts, addShift } from '../../../lib/store'

export async function GET() { return Response.json(getShifts()) }
export async function POST(req: Request) {
  const { staffId, date, startTime, endTime, role } = await req.json()
  if (!staffId || !date || !startTime || !endTime || !role) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addShift({ staffId, date, startTime, endTime, role }), { status: 201 })
}
