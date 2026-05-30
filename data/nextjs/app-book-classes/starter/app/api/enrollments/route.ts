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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { enrollments } applying ?classId= and ?status= filters
  void req
  void listEnrollments
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: enroll/waitlist; 400 if invalid, 404 if class unknown
  void req
  void createEnrollment
  void findClass
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete with promote-on-cancel; 404 if absent
  void req
  void deleteEnrollment
  return json({ error: 'not implemented' }, 501)
}
