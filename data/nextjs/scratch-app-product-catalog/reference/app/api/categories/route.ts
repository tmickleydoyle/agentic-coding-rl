import { getCategories, addCategory } from '../../../lib/store'

export async function GET() { return Response.json(getCategories()) }
export async function POST(req: Request) {
  const { name, description } = await req.json()
  if (!name || !description) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addCategory({ name, description }), { status: 201 })
}
