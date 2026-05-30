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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { enrollments }
  void req
  void listEnrollments
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: enroll from { courseId }; 400 missing, 404 unknown course, 409 already enrolled
  void req
  void findCourse
  void findEnrollment
  void createEnrollment
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: toggle ?courseId= lesson from { lessonId }; 404 if not enrolled
  void req
  void toggleLesson
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: remove ?courseId= enrollment; 404 if not enrolled
  void req
  void deleteEnrollment
  return json({ error: 'not implemented' }, 501)
}
