import {
  addHabit,
  deleteHabit,
  listHabits,
  toggleDate,
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

export async function GET(_req: Request): Promise<Response> {
  return json({ habits: listHabits() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const habit = addHabit(name.trim())
  return json(habit, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const body = await readBody(req)
  const id = body.id
  const date = body.date
  if (typeof id !== 'string' || id.trim().length === 0) {
    return json({ error: 'not found' }, 404)
  }
  if (typeof date !== 'string' || date.trim().length === 0) {
    return json({ error: 'date required' }, 400)
  }
  const habit = toggleDate(id, date)
  if (!habit) return json({ error: 'not found' }, 404)
  return json(habit)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteHabit(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
