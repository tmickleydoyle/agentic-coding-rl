import {
  createTask,
  deleteTask,
  findTask,
  listTasks,
  updateTask,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { tasks } applying ?projectId= and ?assigneeId= filters
  void req
  void listTasks
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a task from { title, projectId, assigneeId? }; 400 if title blank
  void req
  void createTask
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= update assigneeId/status; 404 if absent
  void req
  void findTask
  void updateTask
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteTask
  return json({ error: 'not implemented' }, 501)
}
