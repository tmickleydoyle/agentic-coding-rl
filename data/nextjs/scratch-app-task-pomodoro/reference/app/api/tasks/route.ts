import {
  createTask,
  deleteTask,
  findTask,
  listTasks,
  toggleTaskDone,
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
  const tasks = listTasks({ done: params.get('done') })
  return json({ tasks })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const task = createTask({ title: title.trim() })
  return json(task, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findTask(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const hasDone = typeof body.done === 'boolean'
  const hasSession = body.session === true
  if (!hasDone && !hasSession) {
    return json(toggleTaskDone(id))
  }
  const updated = updateTask(id, {
    done: hasDone ? (body.done as boolean) : undefined,
    session: hasSession ? true : undefined,
  })
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteTask(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
