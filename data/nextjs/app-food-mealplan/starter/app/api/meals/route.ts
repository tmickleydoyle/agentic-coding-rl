import { createAssignment, deleteAssignment, listAssignments } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { assignments } applying an optional ?day= filter
  void req
  void listAssignments
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an assignment from { day, recipeId }; 400 on blank day or recipeId
  void req
  void createAssignment
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteAssignment
  return json({ error: 'not implemented' }, 501)
}
