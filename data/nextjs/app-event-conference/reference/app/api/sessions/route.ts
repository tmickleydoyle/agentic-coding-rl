import {
  createSession,
  deleteSession,
  isValidSlot,
  listSessions,
} from '../../../lib/store'

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
  const sessions = listSessions({
    track: params.get('track'),
    slot: params.get('slot'),
  })
  return json({ sessions })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  const track = body.track
  const slot = body.slot
  const speaker = body.speaker
  if (
    typeof title !== 'string' ||
    title.trim().length === 0 ||
    typeof track !== 'string' ||
    track.trim().length === 0 ||
    typeof slot !== 'string' ||
    slot.trim().length === 0 ||
    typeof speaker !== 'string' ||
    speaker.trim().length === 0
  ) {
    return json({ error: 'invalid session' }, 400)
  }
  if (!isValidSlot(slot)) {
    return json({ error: 'bad slot' }, 422)
  }
  const session = createSession({
    title: title.trim(),
    track: track.trim(),
    slot,
    speaker: speaker.trim(),
  })
  return json(session, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteSession(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
