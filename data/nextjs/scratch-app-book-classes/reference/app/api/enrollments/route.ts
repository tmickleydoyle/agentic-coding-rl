import {
  createEnrollment,
  deleteEnrollment,
  findClass,
  listEnrollments,
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
  const params = new URL(req.url).searchParams
  const enrollments = listEnrollments({
    classId: params.get('classId'),
    status: params.get('status'),
  })
  return json({ enrollments })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const classId = body.classId
  const student = body.student
  if (
    typeof classId !== 'string' ||
    classId.trim().length === 0 ||
    typeof student !== 'string' ||
    student.trim().length === 0
  ) {
    return json({ error: 'invalid enrollment' }, 400)
  }
  if (!findClass(classId)) {
    return json({ error: 'class not found' }, 404)
  }
  const enrollment = createEnrollment({ classId, student: student.trim() })
  return json(enrollment, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const result = deleteEnrollment(id)
  if (!result.ok) return json({ error: 'not found' }, 404)
  return json({ ok: true, promotedId: result.promotedId })
}
