import {
  createKey,
  deleteKey,
  hasKey,
  listKeys,
  recordUsage,
  revokeKey,
} from '../../../lib/store'
import type { Scope } from '../../../lib/types'

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

const isScope = (v: unknown): v is Scope => v === 'read' || v === 'write' || v === 'admin'

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const keys = listKeys({
    status: params.get('status'),
    scope: params.get('scope'),
  })
  return json({ keys })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const scopes = Array.isArray(body.scopes) ? body.scopes.filter(isScope) : undefined
  const key = createKey({ name: name.trim(), scopes })
  return json(key, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!hasKey(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const action = body.action
  if (action === 'revoke') return json(revokeKey(id))
  if (action === 'use') return json(recordUsage(id))
  return json({ error: 'unknown action' }, 400)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteKey(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
