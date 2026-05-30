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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { courses } or { course } for ?id=, 404 on unknown id
  void req
  void listCourses
  void findCourse
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: mark { courseId, lessonId } complete; 400 missing, 404 unknown, idempotent
  void req
  void findLesson
  void markComplete
  void listCompleted
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: clear ?courseId=&lessonId= completion; 404 if not complete
  void req
  void clearComplete
  return json({ error: 'not implemented' }, 501)
}
