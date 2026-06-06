import { getHabits, addHabit, getLogs, upsertLog } from '../../../lib/store'

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  if (url.pathname.endsWith('/logs')) {
    return Response.json({ logs: getLogs() })
  }
  return Response.json({ habits: getHabits() })
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const body = await req.json()

  if (url.pathname.endsWith('/logs')) {
    const { habitId, date, completed } = body
    if (!habitId || !date) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    const log = upsertLog({ habitId, date, completed: Boolean(completed) })
    return Response.json(log, { status: 201 })
  }

  const { name, frequency, category } = body
  if (!name) return new Response(JSON.stringify({ error: 'Missing name' }), { status: 400 })
  const habit = addHabit({ name, frequency: frequency ?? 'daily', category: category ?? '' })
  return Response.json(habit, { status: 201 })
}
