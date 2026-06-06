import { getArticles, addArticle, deleteArticle } from '../../../lib/store'
export async function GET() { return Response.json(getArticles()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.title||!b.categoryId||!b.author||!b.content) return Response.json({error:'Missing fields'},{status:400})
  const cats = (await import('../../../lib/store')).getCategories()
  const cat = cats.find((c: {id:string;name:string;description:string})=>c.id===b.categoryId)
  if (!cat) return Response.json({error:'Category not found'},{status:400})
  const today = new Date().toISOString().split('T')[0]
  return Response.json(addArticle({ title:b.title, categoryId:b.categoryId, categoryName:cat.name, author:b.author, content:b.content, status:b.status||'draft', createdDate:b.createdDate||today }),{status:201})
}
export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({error:'Missing id'},{status:400})
  const ok = deleteArticle(id)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
