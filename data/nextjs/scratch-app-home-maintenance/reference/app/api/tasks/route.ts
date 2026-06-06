import { getTasks, addTask, completeTask, deleteTask } from '../../../lib/store'
export async function GET() { return Response.json(getTasks()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.title||!b.room||!b.dueDate) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addTask({ title:b.title, room:b.room, dueDate:b.dueDate, priority:b.priority||'medium', status:'pending' }),{status:201})
}
export async function PATCH(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({error:'Missing id'},{status:400})
  const ok = completeTask(id, new Date().toISOString().split('T')[0])
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({error:'Missing id'},{status:400})
  const ok = deleteTask(id)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
