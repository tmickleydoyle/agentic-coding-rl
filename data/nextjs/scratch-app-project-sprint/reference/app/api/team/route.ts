import { getTeam, addTeamMember } from '../../../lib/store'
export async function GET() { return Response.json(getTeam()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.name||!b.role||!b.email) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addTeamMember({ name:b.name, role:b.role, email:b.email }),{status:201})
}
