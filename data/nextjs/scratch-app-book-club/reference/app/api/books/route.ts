import { getBooks, addBook, deleteBook } from '../../../lib/store'
export async function GET() { return Response.json(getBooks()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.title||!b.author||!b.genre||!b.year) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addBook({ title:b.title, author:b.author, genre:b.genre, year:Number(b.year), status:b.status||'wishlist' }),{status:201})
}
export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({error:'Missing id'},{status:400})
  const ok = deleteBook(id)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
