import { getSuppliers, addSupplier } from '../../../lib/store'

export async function GET() { return Response.json(getSuppliers()) }
export async function POST(req: Request) {
  const { name, category, country } = await req.json()
  if (!name || !category || !country) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addSupplier({ name, category, country }), { status: 201 })
}
