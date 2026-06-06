import { getCategories, addCategory, deleteCategory } from '../../../lib/store'
export async function GET() { return Response.json(getCategories()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.name) return Response.json({error:'Missing name'},{status:400})
  return Response.json(addCategory({ name:b.name, description:b.description||'' }),{status:201})
}
export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({error:'Missing id'},{status:400})
  const ok = deleteCategory(id)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
