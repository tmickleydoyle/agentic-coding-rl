import {
  createInitiative,
  deleteInitiative,
  findInitiative,
  listInitiatives,
  updateInitiative,
} from '../../../lib/store'
import type { Status } from '../../../lib/types'

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

const STATUSES: Status[] = ['planned', 'in-progress', 'done']

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const initiatives = listInitiatives({
    quarterId: params.get('quarterId'),
    status: params.get('status'),
  })
  return json({ initiatives })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const quarterId = typeof body.quarterId === 'string' ? body.quarterId : undefined
  const initiative = createInitiative({ title: title.trim(), quarterId })
  return json(initiative, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findInitiative(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { quarterId?: string; status?: Status } = {}
  if (typeof body.quarterId === 'string') patch.quarterId = body.quarterId
  if (typeof body.status === 'string' && STATUSES.includes(body.status as Status)) {
    patch.status = body.status as Status
  }
  const updated = updateInitiative(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteInitiative(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
