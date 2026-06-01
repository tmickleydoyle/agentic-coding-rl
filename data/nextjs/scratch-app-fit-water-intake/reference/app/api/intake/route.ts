import {
  createDrink,
  deleteDrink,
  getGoal,
  getReminders,
  listDrinks,
  setGoal,
  setReminders,
  totalForDate,
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
  const date = new URL(req.url).searchParams.get('date')
  if (date) {
    return json({ date, total: totalForDate(date) })
  }
  return json({ drinks: listDrinks(), goal: getGoal(), reminders: getReminders() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return json({ error: 'amount invalid' }, 400)
  }
  const date = typeof body.date === 'string' && body.date.trim().length > 0
    ? body.date
    : '2026-05-28'
  const drink = createDrink({ date, amount })
  return json(drink, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const body = await readBody(req)
  const patch: { goal?: number; reminders?: number } = {}
  if (typeof body.goal === 'number' && !Number.isNaN(body.goal) && body.goal > 0) {
    patch.goal = setGoal(body.goal)
  } else if (body.goal !== undefined) {
    return json({ error: 'goal invalid' }, 400)
  }
  if (typeof body.reminders === 'number' && !Number.isNaN(body.reminders) && body.reminders >= 0) {
    patch.reminders = setReminders(body.reminders)
  } else if (body.reminders !== undefined) {
    return json({ error: 'reminders invalid' }, 400)
  }
  return json({ goal: getGoal(), reminders: getReminders() })
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteDrink(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
