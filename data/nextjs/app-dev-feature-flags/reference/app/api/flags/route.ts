import { createFlag, deleteFlag, findFlag, listFlags, updateFlag } from '../../../lib/store'
import type { Env } from '../../../lib/types'

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

const isEnv = (v: unknown): v is Env => v === 'dev' || v === 'stage' || v === 'prod'

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const flags = listFlags({ env: params.get('env') })
  return json({ flags })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const key = body.key
  if (typeof key !== 'string' || key.trim().length === 0) {
    return json({ error: 'key required' }, 400)
  }
  const description = typeof body.description === 'string' ? body.description : undefined
  const flag = createFlag({ key: key.trim(), description })
  return json(flag, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findFlag(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { env?: Env; enabled?: boolean; rollout?: number } = {}
  if (isEnv(body.env)) {
    patch.env = body.env
    if (typeof body.enabled === 'boolean') patch.enabled = body.enabled
  }
  if (typeof body.rollout === 'number') patch.rollout = body.rollout
  const updated = updateFlag(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteFlag(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
