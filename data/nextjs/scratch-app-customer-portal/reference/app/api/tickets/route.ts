import { getTickets, addTicket } from '../../../lib/store'

export async function GET() { return Response.json(getTickets()) }
export async function POST(req: Request) {
  const { subject, priority } = await req.json()
  if (!subject || !priority) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addTicket({ subject, priority }), { status: 201 })
}
