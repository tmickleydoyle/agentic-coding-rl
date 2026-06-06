import { getSessions, addSession } from '../../../lib/store'

export async function GET() {
  return Response.json(getSessions())
}

export async function POST(req: Request) {
  const { title, eventId, startTime, endTime, speaker } = await req.json()
  if (!title || !eventId || !startTime || !endTime || !speaker) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addSession({ title, eventId, startTime, endTime, speaker }), { status: 201 })
}
