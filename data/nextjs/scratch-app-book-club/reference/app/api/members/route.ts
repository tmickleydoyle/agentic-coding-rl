import { getMembers, addMember } from '../../../lib/store'
export async function GET() { return Response.json(getMembers()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.name||!b.joinDate) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addMember({ name:b.name, joinDate:b.joinDate }),{status:201})
}
