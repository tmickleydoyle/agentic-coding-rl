import { getReviews, addReview, getBooks, getMembers } from '../../../lib/store'
export async function GET() { return Response.json(getReviews()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.bookId||!b.memberId||!b.text||!b.date) return Response.json({error:'Missing fields'},{status:400})
  const book = getBooks().find(x=>x.id===b.bookId)
  const member = getMembers().find(x=>x.id===b.memberId)
  if (!book||!member) return Response.json({error:'Book or member not found'},{status:400})
  return Response.json(addReview({ bookId:b.bookId, bookTitle:book.title, memberId:b.memberId, memberName:member.name, rating:Number(b.rating)||5, text:b.text, date:b.date }),{status:201})
}
