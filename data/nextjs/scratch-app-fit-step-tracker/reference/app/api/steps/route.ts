import {
  deleteEntry,
  getGoal,
  listEntries,
  setGoal,
  upsertEntry,
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
  return json({ entries: listEntries(), goal: getGoal() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const date = body.date
  const steps = body.steps
  if (typeof date !== 'string' || date.trim().length === 0) {
    return json({ error: 'date required' }, 400)
  }
  if (typeof steps !== 'number' || Number.isNaN(steps) || steps < 0) {
    return json({ error: 'steps invalid' }, 400)
  }
  const entry = upsertEntry({ date, steps })
  return json(entry, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const body = await readBody(req)
  const goal = body.goal
  if (typeof goal !== 'number' || Number.isNaN(goal) || goal <= 0) {
    return json({ error: 'goal invalid' }, 400)
  }
  return json({ goal: setGoal(goal) })
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEntry(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
