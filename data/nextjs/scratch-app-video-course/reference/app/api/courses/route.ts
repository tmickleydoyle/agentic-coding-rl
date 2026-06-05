import {
  clearComplete,
  findCourse,
  findLesson,
  listCompleted,
  listCourses,
  markComplete,
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

export async function GET(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id')
  if (id) {
    const course = findCourse(id)
    if (!course) return json({ error: 'not found' }, 404)
    return json({ course })
  }
  return json({ courses: listCourses() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const courseId = body.courseId
  const lessonId = body.lessonId
  if (
    typeof courseId !== 'string' ||
    courseId.trim().length === 0 ||
    typeof lessonId !== 'string' ||
    lessonId.trim().length === 0
  ) {
    return json({ error: 'courseId and lessonId required' }, 400)
  }
  if (!findLesson(courseId, lessonId)) return json({ error: 'not found' }, 404)
  const wasComplete = listCompleted().includes(`${courseId}:${lessonId}`)
  const completedKeys = markComplete(courseId, lessonId)
  return json({ completedKeys }, wasComplete ? 200 : 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const courseId = params.get('courseId') ?? ''
  const lessonId = params.get('lessonId') ?? ''
  const ok = clearComplete(courseId, lessonId)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
