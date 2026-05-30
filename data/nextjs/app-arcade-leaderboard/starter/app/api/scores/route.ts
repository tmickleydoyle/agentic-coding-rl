import { createScore, deleteScore, listScores } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { scores } applying ?gameId and ?sort=rank
  void req
  void listScores
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a score; 400 bad game / player required / bad points
  void req
  void createScore
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteScore
  return json({ error: 'not implemented' }, 501)
}
