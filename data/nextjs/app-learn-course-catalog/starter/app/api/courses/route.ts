import { findCourse, listCourses } from '../../../lib/store'

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
