import {
  createRequest,
  deleteRequest,
  findRequest,
  listRequests,
  updateRequest,
} from '../../../lib/store'
import type { LeaveStatus } from '../../../lib/types'
import { STATUSES } from '../../../lib/types'

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
  const requests = listRequests({
    employeeId: params.get('employeeId'),
    status: params.get('status'),
  })
  return json({ requests })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const employeeId = body.employeeId
  const day = body.day
  if (typeof employeeId !== 'string' || employeeId.trim().length === 0) {
    return json({ error: 'employeeId required' }, 400)
  }
  if (typeof day !== 'string' || day.trim().length === 0) {
    return json({ error: 'day required' }, 400)
  }
  const days = typeof body.days === 'number' ? body.days : undefined
  const reason = typeof body.reason === 'string' ? body.reason : undefined
  const request = createRequest({ employeeId, day, days, reason })
  return json(request, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findRequest(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { status?: LeaveStatus } = {}
  if (typeof body.status === 'string' && STATUSES.includes(body.status as LeaveStatus)) {
    patch.status = body.status as LeaveStatus
  }
  const updated = updateRequest(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteRequest(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
