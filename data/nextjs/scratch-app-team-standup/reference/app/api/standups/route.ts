import { createEntry, deleteEntry, listEntries } from '../../../lib/store'

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
    date: params.get('date'),
    memberId: params.get('memberId'),
    blockers: params.get('blockers') === 'true',
  })
  return json({ entries })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const yesterday = body.yesterday
  const today = body.today
  if (
    typeof yesterday !== 'string' ||
    yesterday.trim().length === 0 ||
    typeof today !== 'string' ||
    today.trim().length === 0
  ) {
    return json({ error: 'yesterday and today required' }, 400)
  }
  const memberId = typeof body.memberId === 'string' ? body.memberId : 'm1'
  const date = typeof body.date === 'string' ? body.date : undefined
  const blocker = typeof body.blocker === 'string' ? body.blocker : null
  const entry = createEntry({ memberId, date, yesterday: yesterday.trim(), today: today.trim(), blocker })
  return json(entry, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEntry(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
