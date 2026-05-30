import {
  createTask,
  deleteTask,
  findTask,
  listTasks,
  updateTask,
} from '../../../lib/store'
import { isQuadrant } from '../../../lib/types'
import type { Quadrant } from '../../../lib/types'

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
  const q = new URL(req.url).searchParams.get('quadrant')
  if (q !== null && !isQuadrant(q)) {
    return json({ error: 'invalid quadrant' }, 400)
  }
  const tasks = listTasks({ quadrant: (q as Quadrant | null) })
  return json({ tasks })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const urgent = typeof body.urgent === 'boolean' ? body.urgent : false
  const important = typeof body.important === 'boolean' ? body.important : false
  const task = createTask({ title: title.trim(), urgent, important })
  return json(task, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findTask(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { quadrant?: Quadrant; urgent?: boolean; important?: boolean } = {}
  if (body.quadrant !== undefined) {
    if (!isQuadrant(body.quadrant)) return json({ error: 'invalid quadrant' }, 400)
    patch.quadrant = body.quadrant
  }
  if (typeof body.urgent === 'boolean') patch.urgent = body.urgent
  if (typeof body.important === 'boolean') patch.important = body.important
  const updated = updateTask(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteTask(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
