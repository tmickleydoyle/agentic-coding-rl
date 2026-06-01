import { findCourse, listCourses } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id')
  if (id) {
    const course = findCourse(id)
    if (!course) return json({ error: 'not found' }, 404)
    return json({ course })
  }
  return json({ courses: listCourses() })
}
