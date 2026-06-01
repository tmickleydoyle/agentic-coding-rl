import {
  createGroup,
  deleteGroup,
  findGroup,
  listGroups,
  patchMembers,
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
  const groups = listGroups({ memberId: params.get('memberId') })
  return json({ groups })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const adminId = body.adminId
  if (typeof adminId !== 'string' || adminId.trim().length === 0) {
    return json({ error: 'adminId required' }, 400)
  }
  const group = createGroup({ name: name.trim(), adminId })
  return json(group, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findGroup(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { add?: string; remove?: string } = {}
  if (typeof body.add === 'string') patch.add = body.add
  if (typeof body.remove === 'string') patch.remove = body.remove
  const updated = patchMembers(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteGroup(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
