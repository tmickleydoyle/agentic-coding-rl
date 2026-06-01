import {
  createRecipe,
  deleteRecipe,
  findRecipe,
  listRecipes,
  updateRecipe,
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

const toStringArray = (v: unknown): string[] | undefined => {
  if (!Array.isArray(v)) return undefined
  return v.filter((x): x is string => typeof x === 'string')
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const recipes = listRecipes({
    cuisine: params.get('cuisine'),
    favorite: params.get('favorite'),
  })
  return json({ recipes })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const recipe = createRecipe({
    title: title.trim(),
    cuisine: typeof body.cuisine === 'string' ? body.cuisine : undefined,
    minutes: typeof body.minutes === 'number' ? body.minutes : undefined,
    ingredients: toStringArray(body.ingredients),
    steps: toStringArray(body.steps),
  })
  return json(recipe, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findRecipe(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { favorite?: boolean; title?: string; cuisine?: string } = {}
  if (typeof body.favorite === 'boolean') patch.favorite = body.favorite
  else patch.favorite = !existing.favorite // no explicit favorite => toggle
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.cuisine === 'string') patch.cuisine = body.cuisine
  const updated = updateRecipe(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteRecipe(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
