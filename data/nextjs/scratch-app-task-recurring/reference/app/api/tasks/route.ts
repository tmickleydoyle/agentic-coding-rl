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
    due: params.get('due'),
    schedule: params.get('schedule'),
  })
  return json({ tasks })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  let schedule: 'daily' | 'weekly' = 'daily'
  if (body.schedule !== undefined) {
    if (!isSchedule(body.schedule)) return json({ error: 'invalid schedule' }, 400)
    schedule = body.schedule
  }
  const task = createTask({ title: title.trim(), schedule })
  return json(task, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findTask(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (body.complete === true) {
    return json(completeTask(id))
  }
  return json(findTask(id))
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteTask(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
