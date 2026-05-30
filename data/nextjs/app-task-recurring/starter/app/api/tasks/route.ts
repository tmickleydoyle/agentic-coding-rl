import {
  completeTask,
  createTask,
  deleteTask,
  findTask,
  listTasks,
} from '../../../lib/store'
import { isSchedule } from '../../../lib/types'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { tasks } applying ?due= and ?schedule= filters
  void req
  void listTasks
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a task from { title, schedule? }; 400 if title blank or schedule invalid
  void req
  void createTask
  void isSchedule
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= with { complete: true } advances nextDue; 404 if absent
  void req
  void findTask
  void completeTask
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteTask
  return json({ error: 'not implemented' }, 501)
}
