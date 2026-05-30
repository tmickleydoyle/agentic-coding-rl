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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { assignments }
  void req
  void listAssignments
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an assignment from { title }; 400 if blank
  void req
  void createAssignment
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: record a grade for ?studentId=&assignmentId= from { score }; 404 unknown
  // student/assignment, 400 non-numeric score
  void req
  void findStudent
  void findAssignment
  void setGrade
  return json({ error: 'not implemented' }, 501)
}
