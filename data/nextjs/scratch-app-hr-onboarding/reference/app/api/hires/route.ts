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
  const tasksParam = params.get('tasks')
  if (tasksParam !== null) {
    const hireId = params.get('hireId')
    return json({ tasks: listTasks({ hireId }) })
  }
  return json({ hires: hiresWithProgress() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  // Adding a task: { hireId, label }
  if (typeof body.label === 'string' && typeof body.hireId === 'string') {
    if (body.label.trim().length === 0) {
      return json({ error: 'label required' }, 400)
    }
    if (!findHire(body.hireId)) {
      return json({ error: 'hire not found' }, 404)
    }
    const task = createTask({ hireId: body.hireId, label: body.label.trim() })
    return json(task, 201)
  }
  // Adding a hire: { name, role?, startDate? }
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const role = typeof body.role === 'string' ? body.role : undefined
  const startDate = typeof body.startDate === 'string' ? body.startDate : undefined
  const hire = createHire({ name: name.trim(), role, startDate })
  return json(hire, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findTask(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const done = typeof body.done === 'boolean' ? body.done : !existing.done
  const updated = setTaskDone(id, done)
  return json(updated)
}
