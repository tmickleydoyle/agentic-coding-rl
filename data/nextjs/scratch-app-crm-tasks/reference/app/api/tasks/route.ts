import {
  countsByContact,
  createFollowUp,
  deleteFollowUp,
  findFollowUp,
  listFollowUps,
  toggleFollowUp,
  updateFollowUp,
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
  if (params.get('byContact') === 'true') {
    return json({ contacts: countsByContact() })
  }
  const doneParam = params.get('done')
  const done = doneParam === 'true' ? true : doneParam === 'false' ? false : null
  const followups = listFollowUps({ done, contactId: params.get('contactId') })
  return json({ tasks: followups })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const contactId = typeof body.contactId === 'string' ? body.contactId : undefined
  const dueDate = typeof body.dueDate === 'string' ? body.dueDate : undefined
  const followup = createFollowUp({ title: title.trim(), contactId, dueDate })
  return json(followup, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findFollowUp(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (!('done' in body) && !('dueDate' in body) && !('title' in body)) {
    return json(toggleFollowUp(id))
  }
  const patch: { done?: boolean; dueDate?: string; title?: string } = {}
  if (typeof body.done === 'boolean') patch.done = body.done
  if (typeof body.dueDate === 'string') patch.dueDate = body.dueDate
  if (typeof body.title === 'string') patch.title = body.title
  return json(updateFollowUp(id, patch))
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteFollowUp(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
