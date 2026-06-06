import { getStaff, addStaff } from '../../../lib/store'

export async function GET() { return Response.json(getStaff()) }
export async function POST(req: Request) {
  const { name, email, role, department } = await req.json()
  if (!name || !email || !role || !department) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addStaff({ name, email, role, department }), { status: 201 })
}
