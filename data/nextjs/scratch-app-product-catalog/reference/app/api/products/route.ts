import { getProducts, addProduct } from '../../../lib/store'

export async function GET() { return Response.json(getProducts()) }
export async function POST(req: Request) {
  const { name, sku, price, categoryId, stock } = await req.json()
  if (!name || !sku || price == null || !categoryId || stock == null) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addProduct({ name, sku, price, categoryId, stock }), { status: 201 })
}
