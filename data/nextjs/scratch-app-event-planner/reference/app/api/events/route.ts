import { getEvents, addEvent, deleteEvent } from '../../../lib/store'
export async function GET() { return Response.json(getEvents()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.title||!b.date||!b.location) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addEvent({ title:b.title, date:b.date, location:b.location, category:b.category||'other', status:b.status||'planned' }),{status:201})
}
export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({error:'Missing id'},{status:400})
  const ok = deleteEvent(id)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
