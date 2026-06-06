import { getInventory, addInventoryItem } from '../../../lib/store'

export async function GET() { return Response.json(getInventory()) }
export async function POST(req: Request) {
  const { name, sku, quantity, locationId, category } = await req.json()
  if (!name || !sku || quantity == null || !locationId || !category) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addInventoryItem({ name, sku, quantity, locationId, category }), { status: 201 })
}
