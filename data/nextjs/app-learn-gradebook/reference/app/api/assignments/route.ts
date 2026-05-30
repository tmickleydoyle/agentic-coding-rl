import {
  createAssignment,
  findAssignment,
  findStudent,
  listAssignments,
  setGrade,
} from '../../../lib/store'

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

export async function GET(_req: Request): Promise<Response> {
  return json({ assignments: listAssignments() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  return json(createAssignment(title.trim()), 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const studentId = params.get('studentId') ?? ''
  const assignmentId = params.get('assignmentId') ?? ''
  if (!findStudent(studentId) || !findAssignment(assignmentId)) {
    return json({ error: 'not found' }, 404)
  }
  const body = await readBody(req)
  const score = typeof body.score === 'number' ? body.score : Number(body.score)
  if (Number.isNaN(score)) return json({ error: 'score required' }, 400)
  return json(setGrade(studentId, assignmentId, score))
}
