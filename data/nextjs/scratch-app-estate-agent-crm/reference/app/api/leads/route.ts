import {
  createLead,
  deleteLead,
  findLead,
  isValidStatus,
  listLeads,
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
  const id = params.get('id')
  if (id) {
    const lead = findLead(id)
    if (!lead) return json({ error: 'not found' }, 404)
    return json(lead)
  }
  return json({ leads: listLeads({ status: params.get('status') }) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const status = typeof body.status === 'string' ? body.status : undefined
  const propertyId =
    typeof body.propertyId === 'string' ? body.propertyId : body.propertyId === null ? null : undefined
  const lead = createLead({ name: name.trim(), status, propertyId })
  return json(lead, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findLead(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { status?: LeadStatus; propertyId?: string | null } = {}
  if (body.status !== undefined) {
    if (!isValidStatus(body.status)) return json({ error: 'invalid status' }, 400)
    patch.status = body.status
  }
  if (typeof body.propertyId === 'string') patch.propertyId = body.propertyId
  else if (body.propertyId === null) patch.propertyId = null
  const updated = updateLead(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteLead(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
