import {
  createHire,
  createTask,
  findHire,
  findTask,
  hiresWithProgress,
  listTasks,
  setTaskDone,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: default to { hires } with progress; with ?tasks return { tasks } (optionally
  // filtered by ?hireId=)
  void req
  void hiresWithProgress
  void listTasks
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: body with { hireId, label } creates a task (404 if hire missing); otherwise body
  // with { name, role?, startDate? } creates a hire; 400 on blank name/label
  void req
  void createHire
  void createTask
  void findHire
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set a task done (toggle when body has no `done`); 404 if absent
  void req
  void findTask
  void setTaskDone
  return json({ error: 'not implemented' }, 501)
}
