import { getHoldings, addHolding, deleteHolding } from '../../../lib/store'
export async function GET() { return Response.json(getHoldings()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.symbol||!b.name||b.quantity==null||b.purchasePrice==null||b.currentPrice==null) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addHolding(b),{status:201})
}
export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({error:'Missing id'},{status:400})
  const ok = deleteHolding(id)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
