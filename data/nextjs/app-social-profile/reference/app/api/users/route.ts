import {
  createUser,
  deleteUser,
  findUser,
  listUsers,
  updateUser,
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
  const q = new URL(req.url).searchParams.get('q')
  return json({ users: listUsers({ q }) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const bio = typeof body.bio === 'string' ? body.bio : undefined
  const user = createUser({ name: name.trim(), bio })
  return json(user, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findUser(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { name?: string; bio?: string } = {}
  if (typeof body.name === 'string') {
    if (body.name.trim().length === 0) return json({ error: 'name required' }, 400)
    patch.name = body.name.trim()
  }
  if (typeof body.bio === 'string') patch.bio = body.bio
  const updated = updateUser(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteUser(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
