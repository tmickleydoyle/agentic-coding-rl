import {
  createEnrollment,
  deleteEnrollment,
  findCourse,
  findEnrollment,
  listEnrollments,
  toggleLesson,
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
  return json({ enrollments: listEnrollments() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const courseId = body.courseId
  if (typeof courseId !== 'string' || courseId.trim().length === 0) {
    return json({ error: 'courseId required' }, 400)
  }
  if (!findCourse(courseId)) return json({ error: 'not found' }, 404)
  if (findEnrollment(courseId)) return json({ error: 'already enrolled' }, 409)
  return json(createEnrollment(courseId), 201)
}

export async function PUT(req: Request): Promise<Response> {
  const courseId = new URL(req.url).searchParams.get('courseId') ?? ''
  const body = await readBody(req)
  const lessonId = typeof body.lessonId === 'string' ? body.lessonId : ''
  const updated = toggleLesson(courseId, lessonId)
  if (!updated) return json({ error: 'not found' }, 404)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const courseId = new URL(req.url).searchParams.get('courseId') ?? ''
  const ok = deleteEnrollment(courseId)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
