import { getTickets, addTicket, updateTicketStatus, getSprints, getTeam } from '../../../lib/store'
export async function GET() { return Response.json(getTickets()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.title||!b.sprintId||!b.assigneeId) return Response.json({error:'Missing fields'},{status:400})
  const sprint = getSprints().find(s=>s.id===b.sprintId)
  const member = getTeam().find(m=>m.id===b.assigneeId)
  if (!sprint||!member) return Response.json({error:'Sprint or member not found'},{status:400})
  return Response.json(addTicket({ title:b.title, sprintId:b.sprintId, sprintName:sprint.name, assigneeId:b.assigneeId, assigneeName:member.name, status:b.status||'open', priority:b.priority||'medium' }),{status:201})
}
export async function PATCH(req: Request) {
  const { id, status } = await req.json()
  if (!id||!status) return Response.json({error:'Missing fields'},{status:400})
  const ok = updateTicketStatus(id, status)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
