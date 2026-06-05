import {
  addRoutine,
  deleteRoutine,
  listRoutines,
  toggleStep,
} from '../../../lib/store'
import type { RoutineKind } from '../../../lib/types'

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

export async function GET(_req: Request): Promise<Response> {
  return json({ routines: listRoutines() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const kind: RoutineKind = body.kind === 'evening' ? 'evening' : 'morning'
  const routine = addRoutine({ name: name.trim(), kind })
  return json(routine, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const body = await readBody(req)
  const routineId = typeof body.routineId === 'string' ? body.routineId : ''
  const stepId = typeof body.stepId === 'string' ? body.stepId : ''
  const result = toggleStep(routineId, stepId)
  if (result.kind === 'no-routine') return json({ error: 'routine not found' }, 404)
  if (result.kind === 'no-step') return json({ error: 'step not found' }, 404)
  return json(result.routine)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteRoutine(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
