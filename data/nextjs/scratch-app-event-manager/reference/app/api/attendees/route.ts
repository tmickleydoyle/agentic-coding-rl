import { getAttendees, addAttendee } from '../../../lib/store'

export async function GET() {
  return Response.json(getAttendees())
}

export async function POST(req: Request) {
  const { name, email, eventId } = await req.json()
  if (!name || !email || !eventId) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addAttendee({ name, email, eventId }), { status: 201 })
}
