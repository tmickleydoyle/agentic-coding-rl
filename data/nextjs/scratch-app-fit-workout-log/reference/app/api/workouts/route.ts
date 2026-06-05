import {
  createWorkout,
  deleteWorkout,
  findWorkout,
  listWorkouts,
  recordFor,
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
  const recordExercise = params.get('record')
  if (recordExercise) {
    return json({ exerciseId: recordExercise, record: recordFor(recordExercise) })
  }
  const id = params.get('id')
  if (id) {
    const workout = findWorkout(id)
    if (!workout) return json({ error: 'not found' }, 404)
    return json(workout)
  }
  return json({ workouts: listWorkouts() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const date = typeof body.date === 'string' ? body.date : undefined
  const exercises = Array.isArray(body.exercises)
    ? (body.exercises as never[])
    : undefined
  const workout = createWorkout({ name: name.trim(), date, exercises })
  return json(workout, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteWorkout(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
