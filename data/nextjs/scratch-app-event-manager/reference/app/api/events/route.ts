import { getEvents, addEvent } from '../../../lib/store'

export async function GET() {
  return Response.json(getEvents())
}

export async function POST(req: Request) {
  const { name, date, venue, capacity } = await req.json()
  if (!name || !date || !venue || !capacity) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addEvent({ name, date, venue, capacity }), { status: 201 })
}
