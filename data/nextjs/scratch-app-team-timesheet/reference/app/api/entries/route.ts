import {
  createEntry,
  deleteEntry,
  listEntries,
  submitEntry,
  totalsByProject,
  weekTotal,
} from '../../../lib/store'
import type { Day } from '../../../lib/types'
import { DAYS } from '../../../lib/types'

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
  const entries = listEntries({
    projectId: params.get('projectId'),
    day: params.get('day'),
  })
  return json({ entries, totalsByProject: totalsByProject(), weekTotal: weekTotal() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const hours = typeof body.hours === 'number' ? body.hours : Number(body.hours)
  if (body.hours === undefined || body.hours === null || Number.isNaN(hours)) {
    return json({ error: 'hours required' }, 400)
  }
  const projectId = typeof body.projectId === 'string' ? body.projectId : 'p1'
  const rawDay = typeof body.day === 'string' ? body.day : 'mon'
  const day: Day = (DAYS as string[]).includes(rawDay) ? (rawDay as Day) : 'mon'
  const entry = createEntry({ projectId, day, hours })
  return json(entry, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const updated = submitEntry(id)
  if (!updated) return json({ error: 'not found' }, 404)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEntry(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
