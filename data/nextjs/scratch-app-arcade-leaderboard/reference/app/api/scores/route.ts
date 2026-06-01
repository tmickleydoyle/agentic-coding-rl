import { createScore, deleteScore, listScores } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const gameId = params.get('gameId')
  const sort = params.get('sort')
  return json({ scores: listScores({ gameId, sort }) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const result = createScore({
    gameId: body.gameId,
    player: body.player,
    points: body.points,
  })
  if (!result.ok) return json({ error: result.error }, 400)
  return json(result.score, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteScore(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
