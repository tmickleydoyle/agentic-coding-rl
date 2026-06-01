import {
  createChat,
  deleteChat,
  findChat,
  listChats,
  updateChat,
} from '../../../lib/store'
import type { Status } from '../../../lib/types'

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
  const status = new URL(req.url).searchParams.get('status')
  const filter = status === 'open' || status === 'closed' ? { status: status as Status } : undefined
  const chats = listChats(filter)
  return json({ chats })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const customer = body.customer
  if (typeof customer !== 'string' || customer.trim().length === 0) {
    return json({ error: 'customer required' }, 400)
  }
  const chat = createChat({ customer: customer.trim() })
  return json(chat, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findChat(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { status?: Status; agentId?: string | null } = {}
  if (body.status === 'open' || body.status === 'closed') patch.status = body.status
  if ('agentId' in body) {
    const a = body.agentId
    patch.agentId = typeof a === 'string' ? a : null
  }
  const updated = updateChat(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteChat(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
