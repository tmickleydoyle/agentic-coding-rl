import { getLocations, addLocation } from '../../../lib/store'

export async function GET() { return Response.json(getLocations()) }
export async function POST(req: Request) {
  const { code, zone, capacity } = await req.json()
  if (!code || !zone || capacity == null) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addLocation({ code, zone, capacity }), { status: 201 })
}
