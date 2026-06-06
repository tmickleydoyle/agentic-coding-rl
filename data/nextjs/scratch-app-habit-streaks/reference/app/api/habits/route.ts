import { getHabits, addHabit, getCompletions, addCompletion } from '../../../lib/store'

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  if (url.pathname.endsWith('/completions')) {
    return Response.json({ completions: getCompletions() })
  }
  return Response.json({ habits: getHabits() })
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const body = await req.json()

  if (url.pathname.endsWith('/completions')) {
    const { habitId, date } = body
    if (!habitId || !date) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    const c = addCompletion({ habitId, date })
    return Response.json(c, { status: 201 })
  }

  const { name, color } = body
  if (!name) return new Response(JSON.stringify({ error: 'Missing name' }), { status: 400 })
  const h = addHabit({ name, color: color ?? '' })
  return Response.json(h, { status: 201 })
}
