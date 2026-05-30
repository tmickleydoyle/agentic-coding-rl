import {
  createSubscriber,
  deleteSubscriber,
  listSubscribers,
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
  const subscribers = listSubscribers({ active: params.get('active') })
  return json({ subscribers })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const email = body.email
  if (typeof email !== 'string' || email.trim().length === 0) {
    return json({ error: 'email required' }, 400)
  }
  if (!email.includes('@')) {
    return json({ error: 'invalid email' }, 400)
  }
  const subscriber = createSubscriber({ email: email.trim() })
  return json(subscriber, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteSubscriber(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
