import { findQuiz, gradeQuiz, listQuizzes } from '../../../lib/store'

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
  const id = new URL(req.url).searchParams.get('id')
  if (id) {
    const quiz = findQuiz(id)
    if (!quiz) return json({ error: 'not found' }, 404)
    return json({ quiz })
  }
  return json({ quizzes: listQuizzes() })
}

export async function POST(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (id.trim().length === 0) return json({ error: 'id required' }, 400)
  const quiz = findQuiz(id)
  if (!quiz) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const raw = body.answers
  const answers: Record<string, string> = {}
  if (raw && typeof raw === 'object') {
    Object.keys(raw as Record<string, unknown>).forEach((k) => {
      const v = (raw as Record<string, unknown>)[k]
      if (typeof v === 'string') answers[k] = v
    })
  }
  return json(gradeQuiz(quiz, answers))
}
