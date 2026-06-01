import {
  createIssue,
  deleteIssue,
  findIssue,
  listIssues,
  updateIssue,
} from '../../../lib/store'
import type { IssueStatus, Priority } from '../../../lib/types'

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

const isPriority = (v: unknown): v is Priority => v === 'low' || v === 'medium' || v === 'high'
const isStatus = (v: unknown): v is IssueStatus =>
  v === 'open' || v === 'in-progress' || v === 'closed'

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const issues = listIssues({
    label: params.get('label'),
    priority: params.get('priority'),
    assignee: params.get('assignee'),
  })
  return json({ issues })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const labels = Array.isArray(body.labels)
    ? body.labels.filter((l): l is string => typeof l === 'string')
    : undefined
  const priority = isPriority(body.priority) ? body.priority : undefined
  const assignee = typeof body.assignee === 'string' ? body.assignee : null
  const issue = createIssue({ title: title.trim(), labels, priority, assignee })
  return json(issue, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findIssue(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { assignee?: string | null; priority?: Priority; status?: IssueStatus; labels?: string[] } = {}
  if (typeof body.assignee === 'string' || body.assignee === null) {
    patch.assignee = body.assignee as string | null
  }
  if (isPriority(body.priority)) patch.priority = body.priority
  if (isStatus(body.status)) patch.status = body.status
  if (Array.isArray(body.labels)) {
    patch.labels = body.labels.filter((l): l is string => typeof l === 'string')
  }
  const updated = updateIssue(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteIssue(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
