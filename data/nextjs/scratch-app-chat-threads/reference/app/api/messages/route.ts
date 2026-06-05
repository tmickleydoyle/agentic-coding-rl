import {
  createMessage,
  deleteMessage,
  findMessage,
  listMessages,
  setResolved,
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
  const resolved = new URL(req.url).searchParams.get('resolved')
  const filter =
    resolved === 'true' ? { resolved: true } : resolved === 'false' ? { resolved: false } : undefined
  const messages = listMessages(filter)
  return json({ messages })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const authorId = body.authorId
  if (typeof authorId !== 'string' || authorId.trim().length === 0) {
    return json({ error: 'authorId required' }, 400)
  }
  const text = body.text
  if (typeof text !== 'string' || text.trim().length === 0) {
    return json({ error: 'text required' }, 400)
  }
  const message = createMessage({ authorId, text: text.trim() })
  return json(message, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findMessage(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const resolved = typeof body.resolved === 'boolean' ? body.resolved : undefined
  const updated = setResolved(id, resolved)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteMessage(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
