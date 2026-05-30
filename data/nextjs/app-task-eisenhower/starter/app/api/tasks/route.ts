import {
  createTask,
  deleteTask,
  findTask,
  listTasks,
  updateTask,
} from '../../../lib/store'
import { isQuadrant } from '../../../lib/types'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { tasks } applying ?quadrant= filter; 400 on invalid quadrant
  void req
  void listTasks
  void isQuadrant
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a task from { title, urgent?, important? }; 400 if title blank
  void req
  void createTask
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= move via { quadrant } or set { urgent }/{ important }; 404 if absent; 400 on
  // invalid quadrant
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
