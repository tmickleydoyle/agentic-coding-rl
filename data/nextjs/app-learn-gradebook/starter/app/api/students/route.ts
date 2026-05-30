import {
  createStudent,
  findStudent,
  listStudents,
  studentAverageById,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { students } or { student, average } for ?id=, 404 on unknown id
  void req
  void listStudents
  void findStudent
  void studentAverageById
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a student from { name }; 400 if blank
  void req
  void createStudent
  return json({ error: 'not implemented' }, 501)
}
