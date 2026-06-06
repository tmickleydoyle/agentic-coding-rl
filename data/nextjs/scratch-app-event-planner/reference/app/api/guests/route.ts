import { getGuests, addGuest, updateGuestRsvp, getEvents } from '../../../lib/store'
export async function GET() { return Response.json(getGuests()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.name||!b.email||!b.eventId) return Response.json({error:'Missing fields'},{status:400})
  const event = getEvents().find(e=>e.id===b.eventId)
  if (!event) return Response.json({error:'Event not found'},{status:400})
  return Response.json(addGuest({ name:b.name, email:b.email, eventId:b.eventId, eventTitle:event.title, rsvp:b.rsvp||'pending' }),{status:201})
}
export async function PATCH(req: Request) {
  const { id, rsvp } = await req.json()
  if (!id||!rsvp) return Response.json({error:'Missing fields'},{status:400})
  const ok = updateGuestRsvp(id, rsvp)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
