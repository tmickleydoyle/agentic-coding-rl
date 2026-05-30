import {
  createProject,
  findProject,
  listPosts,
  listProjects,
  updateProject,
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
  const projects = listProjects({
    featured: params.get('featured') === 'true',
    tag: params.get('tag'),
  })
  return json({ projects, posts: listPosts() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string')
    : []
  const project = createProject({ title: title.trim(), tags })
  return json(project, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findProject(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { featured?: boolean } = {}
  if (typeof body.featured === 'boolean') patch.featured = body.featured
  else patch.featured = !existing.featured
  const updated = updateProject(id, patch)
  return json(updated)
}
