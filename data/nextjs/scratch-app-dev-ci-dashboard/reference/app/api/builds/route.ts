import {
  createBuild,
  deleteBuild,
  findBuild,
  listBuilds,
  updateBuild,
} from '../../../lib/store'
import type { BuildStatus } from '../../../lib/types'

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

const isStatus = (v: unknown): v is BuildStatus =>
  v === 'passing' || v === 'failing' || v === 'running'

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const builds = listBuilds({
    status: params.get('status'),
    pipelineId: params.get('pipelineId'),
  })
  return json({ builds })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const pipelineId = body.pipelineId
  if (typeof pipelineId !== 'string' || pipelineId.trim().length === 0) {
    return json({ error: 'pipelineId required' }, 400)
  }
  const durationSec = typeof body.durationSec === 'number' ? body.durationSec : undefined
  const build = createBuild({ pipelineId: pipelineId.trim(), durationSec })
  return json(build, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findBuild(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { status?: BuildStatus; durationSec?: number } = {}
  if (isStatus(body.status)) patch.status = body.status
  else patch.status = 'running' // no explicit status => retry
  if (typeof body.durationSec === 'number') patch.durationSec = body.durationSec
  const updated = updateBuild(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteBuild(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
