import { getTransactions, addTransaction } from '../../../lib/store'
export async function GET() { return Response.json(getTransactions()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.symbol||!b.type||b.quantity==null||b.price==null||!b.date) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addTransaction(b),{status:201})
}
