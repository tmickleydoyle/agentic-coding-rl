import { getAchievements, addAchievement, getGames } from '../../../lib/store'
export async function GET() { return Response.json(getAchievements()) }
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.gameId||!b.name||!b.description||!b.unlockedDate) return Response.json({error:'Missing fields'},{status:400})
  const game = getGames().find(g=>g.id===b.gameId)
  if (!game) return Response.json({error:'Game not found'},{status:400})
  return Response.json(addAchievement({ gameId:b.gameId, gameTitle:game.title, name:b.name, description:b.description, unlockedDate:b.unlockedDate }),{status:201})
}
