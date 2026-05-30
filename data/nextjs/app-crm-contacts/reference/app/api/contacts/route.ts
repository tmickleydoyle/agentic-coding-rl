import {
  addTag,
  createContact,
  deleteContact,
  findContact,
  isKind,
  listActivities,
  listContacts,
  logActivity,
  removeTag,
} from '../../../lib/store'
import type { ActivityKind } from '../../../lib/types'

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
  if (params.get('activity') === 'true') {
    return json({ activities: listActivities(params.get('contactId')) })
  }
  const contacts = listContacts({
    companyId: params.get('companyId'),
    tag: params.get('tag'),
  })
  return json({ contacts })
}

export async function POST(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const body = await readBody(req)

  if (params.get('activity') === 'true') {
    const contactId = typeof body.contactId === 'string' ? body.contactId : ''
    if (!findContact(contactId)) return json({ error: 'not found' }, 404)
    const kind = isKind(body.kind) ? (body.kind as ActivityKind) : 'note'
    const text = body.text
    if (typeof text !== 'string' || text.trim().length === 0) {
      return json({ error: 'text required' }, 400)
    }
    const activity = logActivity({ contactId, kind, text: text.trim() })
    return json(activity, 201)
  }

  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const companyId = typeof body.companyId === 'string' ? body.companyId : undefined
  const tags = Array.isArray(body.tags)
    ? (body.tags.filter((t) => typeof t === 'string') as string[])
    : undefined
  const contact = createContact({ name: name.trim(), companyId, tags })
  return json(contact, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id') ?? ''
  if (!findContact(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const tag = typeof body.tag === 'string' ? body.tag.trim() : ''
  if (!tag) return json({ error: 'tag required' }, 400)
  const op = params.get('op')
  const updated = op === 'remove' ? removeTag(id, tag) : addTag(id, tag)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteContact(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
