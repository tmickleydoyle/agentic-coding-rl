import { getContacts, addContact } from '../../../lib/store'

export async function GET() { return Response.json(getContacts()) }
export async function POST(req: Request) {
  const { name, email, phone, supplierId, role } = await req.json()
  if (!name || !email || !phone || !supplierId || !role) return Response.json({ error: 'Missing fields' }, { status: 400 })
  return Response.json(addContact({ name, email, phone, supplierId, role }), { status: 201 })
}
