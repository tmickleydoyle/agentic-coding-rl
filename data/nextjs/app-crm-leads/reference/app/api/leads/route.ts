import {
  convertLead,
  createLead,
  deleteLead,
  findLead,
  isStatus,
  listLeads,
  statusCounts,
  updateLead,
} from '../../../lib/store'
import type { LeadStatus } from '../../../lib/types'

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
  if (params.get('counts') === 'true') {
    return json({ counts: statusCounts() })
  }
  const minScoreRaw = params.get('minScore')
  const minScore = minScoreRaw !== null ? Number(minScoreRaw) : null
  const leads = listLeads({
    status: params.get('status'),
    minScore: minScore !== null && !Number.isNaN(minScore) ? minScore : null,
  })
  return json({ leads })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const source = typeof body.source === 'string' ? body.source : undefined
  const score = typeof body.score === 'number' ? body.score : undefined
  const lead = createLead({ name: name.trim(), source, score })
  return json(lead, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id') ?? ''
  const existing = findLead(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)

  if (params.get('action') === 'convert') {
    const value = typeof body.value === 'number' ? body.value : 0
    const result = convertLead(id, value)
    return json(result)
  }

  const patch: { status?: LeadStatus; score?: number } = {}
  if (isStatus(body.status)) patch.status = body.status as LeadStatus
  if (typeof body.score === 'number') patch.score = body.score
  const updated = updateLead(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteLead(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
