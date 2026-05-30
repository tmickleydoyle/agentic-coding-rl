import { findQuiz, gradeQuiz, listQuizzes } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { quizzes } or { quiz } for ?id=, 404 on unknown id
  void req
  void listQuizzes
  void findQuiz
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: grade ?id= attempt from { answers }; 400 if id missing, 404 if unknown
  void req
  void gradeQuiz
  return json({ error: 'not implemented' }, 501)
}
