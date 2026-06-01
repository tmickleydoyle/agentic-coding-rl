import {
  assignDay,
  createRoutine,
  deleteRoutine,
  findRoutine,
  listRoutines,
} from '../../../lib/store'
import type { Weekday } from '../../../lib/types'

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
  const id = new URL(req.url).searchParams.get('id')
  if (id) {
    const routine = findRoutine(id)
    if (!routine) return json({ error: 'not found' }, 404)
    return json(routine)
  }
  return json({ routines: listRoutines() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const exerciseIds = Array.isArray(body.exerciseIds)
    ? (body.exerciseIds as unknown[]).filter((x): x is string => typeof x === 'string')
    : []
  const routine = createRoutine({ name: name.trim(), exerciseIds })
  return json(routine, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findRoutine(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const rawDay = body.day
  const day =
    rawDay === null || rawDay === undefined ? null : (rawDay as Weekday)
  const updated = assignDay(id, day)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteRoutine(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
