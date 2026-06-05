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

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const tasks = listTasks({
    status: params.get('status'),
    projectId: params.get('projectId'),
  })
  return json({ tasks })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const projectId = typeof body.projectId === 'string' ? body.projectId : undefined
  const dueDate = typeof body.dueDate === 'string' ? body.dueDate : null
  const task = createTask({ title: title.trim(), projectId, dueDate })
  return json(task, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findTask(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { done?: boolean; title?: string; projectId?: string; dueDate?: string | null } = {}
  if (typeof body.done === 'boolean') patch.done = body.done
  else patch.done = !existing.done // no explicit done => toggle
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.projectId === 'string') patch.projectId = body.projectId
  if (typeof body.dueDate === 'string' || body.dueDate === null) {
    patch.dueDate = body.dueDate as string | null
  }
  const updated = updateTask(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteTask(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
