import {
  createDeployment,
  deleteDeployment,
  findDeployment,
  listDeployments,
  updateDeployment,
} from '../../../lib/store'
import { STATUSES, type DeployStatus } from '../../../lib/types'

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
  const deployments = listDeployments({
    env: params.get('env'),
    status: params.get('status'),
  })
  return json({ deployments })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const service = body.service
  if (typeof service !== 'string' || service.trim().length === 0) {
    return json({ error: 'service required' }, 400)
  }
  const env = typeof body.env === 'string' ? body.env : undefined
  const deployment = createDeployment({ env, service: service.trim() })
  return json(deployment, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findDeployment(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const status =
    typeof body.status === 'string' && STATUSES.includes(body.status as DeployStatus)
      ? (body.status as DeployStatus)
      : 'rolled_back'
  const updated = updateDeployment(id, { status })
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteDeployment(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
