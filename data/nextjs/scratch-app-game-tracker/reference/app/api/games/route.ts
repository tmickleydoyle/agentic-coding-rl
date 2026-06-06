import { getGames, addGame, deleteGame } from '../../../lib/store'
export async function GET() { return Response.json(getGames()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.title||!b.platform||!b.genre) return Response.json({error:'Missing fields'},{status:400})
  return Response.json(addGame({ title:b.title, platform:b.platform, genre:b.genre, status:b.status||'not started' }),{status:201})
}
export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({error:'Missing id'},{status:400})
  const ok = deleteGame(id)
  return ok ? Response.json({success:true}) : Response.json({error:'Not found'},{status:404})
}
