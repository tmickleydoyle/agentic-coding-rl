import { createEvent, deleteEvent, isValidDay, listEvents } from '../../../lib/store'

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
  const events = listEvents({
    category: params.get('category'),
    day: params.get('day'),
  })
  return json({ events })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  const category = body.category
  const day = body.day
  if (
    typeof title !== 'string' ||
    title.trim().length === 0 ||
    typeof category !== 'string' ||
    category.trim().length === 0
  ) {
    return json({ error: 'invalid event' }, 400)
  }
  if (typeof day !== 'number' || !isValidDay(day)) {
    return json({ error: 'bad day' }, 422)
  }
  const event = createEvent({ title: title.trim(), day, category: category.trim() })
  return json(event, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEvent(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
