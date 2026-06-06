import { getSprints, addSprint, updateSprintStatus } from '../../../lib/store'
export async function GET() { return Response.json(getSprints()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.name||!b.startDate||!b.endDate) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addSprint({ name:b.name, startDate:b.startDate, endDate:b.endDate, status:b.status||'planning' }),{status:201})
}
export async function PATCH(req: Request) {
  const { id, status } = await req.json()
  if (!id||!status) return Response.json({error:'Missing fields'},{status:400})
  const ok = updateSprintStatus(id, status)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
