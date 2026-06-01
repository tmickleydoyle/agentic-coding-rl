import {
  createAssignment,
  deleteAssignment,
  listAssignments,
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
  const assignments = listAssignments({ day: params.get('day') })
  return json({ assignments })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const day = body.day
  if (typeof day !== 'string' || day.trim().length === 0) {
    return json({ error: 'day required' }, 400)
  }
  const recipeId = body.recipeId
  if (typeof recipeId !== 'string' || recipeId.trim().length === 0) {
    return json({ error: 'recipeId required' }, 400)
  }
  const assignment = createAssignment({ day: day.trim(), recipeId: recipeId.trim() })
  return json(assignment, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteAssignment(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
