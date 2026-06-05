import { createMeal, deleteMeal, listMeals } from '../../../lib/store'

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
  const meals = listMeals({ date: params.get('date') })
  return json({ meals })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const calories = body.calories
  if (typeof calories !== 'number' || Number.isNaN(calories) || calories < 0) {
    return json({ error: 'calories required' }, 400)
  }
  const date = typeof body.date === 'string' && body.date.length > 0 ? body.date : '2026-05-29'
  const protein = typeof body.protein === 'number' ? body.protein : 0
  const carbs = typeof body.carbs === 'number' ? body.carbs : 0
  const fat = typeof body.fat === 'number' ? body.fat : 0
  const meal = createMeal({ name: name.trim(), date, calories, protein, carbs, fat })
  return json(meal, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteMeal(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
