import {
  createCandidate,
  deleteCandidate,
  findCandidate,
  listCandidates,
  updateCandidate,
} from '../../../lib/store'
import type { Stage } from '../../../lib/types'
import { STAGES } from '../../../lib/types'

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
  const candidates = listCandidates({
    jobId: params.get('jobId'),
    stage: params.get('stage'),
  })
  return json({ candidates })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const jobId = typeof body.jobId === 'string' ? body.jobId : undefined
  const stage =
    typeof body.stage === 'string' && STAGES.includes(body.stage as Stage)
      ? (body.stage as Stage)
      : undefined
  const candidate = createCandidate({ name: name.trim(), jobId, stage })
  return json(candidate, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findCandidate(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { stage?: Stage; jobId?: string } = {}
  if (typeof body.stage === 'string' && STAGES.includes(body.stage as Stage)) {
    patch.stage = body.stage as Stage
  }
  if (typeof body.jobId === 'string') {
    patch.jobId = body.jobId
  }
  const updated = updateCandidate(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteCandidate(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
