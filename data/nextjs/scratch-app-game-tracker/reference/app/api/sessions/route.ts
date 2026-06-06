import { getSessions, addSession, getGames } from '../../../lib/store'
export async function GET() { return Response.json(getSessions()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.gameId||!b.date||b.duration==null) return Response.json({error:'Missing fields'},{status:400})
  const game = getGames().find(g=>g.id===b.gameId)
  if (!game) return Response.json({error:'Game not found'},{status:400})
  return Response.json(addSession({ gameId:b.gameId, gameTitle:game.title, date:b.date, duration:Number(b.duration), notes:b.notes||'' }),{status:201})
}
