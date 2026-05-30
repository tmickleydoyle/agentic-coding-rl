import {
  createObjective,
  findObjective,
  objectivesWithProgress,
  setKeyResultProgress,
} from '../../../lib/store'
import { objectiveProgress } from '../../../lib/progress'

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
  return json(objectivesWithProgress())
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const owner = typeof body.owner === 'string' ? body.owner : undefined
  const objective = createObjective({ title: title.trim(), owner })
  return json(objective, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id') ?? ''
  const kr = params.get('kr') ?? ''
  if (!findObjective(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const progress = typeof body.progress === 'number' ? body.progress : Number(body.progress)
  const updated = setKeyResultProgress(id, kr, progress)
  if (!updated) return json({ error: 'not found' }, 404)
  return json({ ...updated, progress: objectiveProgress(updated) })
}
