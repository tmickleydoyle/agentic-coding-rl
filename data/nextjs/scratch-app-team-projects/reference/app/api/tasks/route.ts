import {
  createTask,
  deleteTask,
  findTask,
  listTasks,
  updateTask,
} from '../../../lib/store'
import type { TaskStatus } from '../../../lib/types'

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

const STATUSES: TaskStatus[] = ['todo', 'doing', 'done']

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const tasks = listTasks({
    projectId: params.get('projectId'),
    assigneeId: params.get('assigneeId'),
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
  const assigneeId =
    typeof body.assigneeId === 'string' ? body.assigneeId : body.assigneeId === null ? null : undefined
  const task = createTask({ title: title.trim(), projectId, assigneeId })
  return json(task, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findTask(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { assigneeId?: string | null; status?: TaskStatus } = {}
  if (typeof body.assigneeId === 'string' || body.assigneeId === null) {
    patch.assigneeId = body.assigneeId as string | null
  }
  if (typeof body.status === 'string' && STATUSES.includes(body.status as TaskStatus)) {
    patch.status = body.status as TaskStatus
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
