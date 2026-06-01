import {
  addMessage,
  assignSession,
  closeSession,
  createSession,
  deleteSession,
  findSession,
  listSessions,
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
  const sessions = listSessions({ status: params.get('status') })
  return json({ sessions })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const visitor = body.visitor
  if (typeof visitor !== 'string' || visitor.trim().length === 0) {
    return json({ error: 'visitor required' }, 400)
  }
  const topic = typeof body.topic === 'string' ? body.topic : undefined
  const session = createSession({ visitor: visitor.trim(), topic })
  return json(session, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findSession(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (body.action === 'assign') {
    const agent = typeof body.agent === 'string' ? body.agent : ''
    if (agent.length === 0) return json({ error: 'agent required' }, 400)
    return json(assignSession(id, agent))
  }
  if (body.action === 'close') return json(closeSession(id))
  if (body.action === 'message') {
    const from = body.from === 'agent' ? 'agent' : 'visitor'
    const text = typeof body.text === 'string' ? body.text : ''
    if (text.trim().length === 0) return json({ error: 'text required' }, 400)
    return json(addMessage(id, { from, text: text.trim() }))
  }
  return json({ error: 'unknown action' }, 400)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteSession(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
