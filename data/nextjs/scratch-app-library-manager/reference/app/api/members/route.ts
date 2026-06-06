import { getMembers, addMember } from '../../../lib/store'

export async function GET() {
  return Response.json(getMembers())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, membershipId, joinDate } = body
  if (!name || !email || !membershipId) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }
  const member = addMember({ name, email, membershipId, joinDate: joinDate ?? new Date().toISOString().slice(0, 10) })
  return Response.json(member, { status: 201 })
}
