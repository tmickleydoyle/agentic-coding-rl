type State = 'pending' | 'paid' | 'shipped' | 'delivered'

const TRANSITIONS: Record<string, { from: State; to: State }> = {
  pay: { from: 'pending', to: 'paid' },
  ship: { from: 'paid', to: 'shipped' },
  deliver: { from: 'shipped', to: 'delivered' },
}

let orders = new Map<number, State>()

export function __reset(): void {
  orders = new Map<number, State>([[1, 'pending']])
}
__reset()

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const id = Number(new URL(req.url).searchParams.get('id'))
  const state = orders.get(id)
  if (state === undefined) return json({ error: 'not found' }, 404)
  return json({ id, state })
}

export async function POST(req: Request): Promise<Response> {
  const id = Number(new URL(req.url).searchParams.get('id'))
  const state = orders.get(id)
  if (state === undefined) return json({ error: 'not found' }, 404)

  let action: unknown
  try {
    action = ((await req.json()) as { action?: unknown }).action
  } catch {
    action = undefined
  }

  const transition = typeof action === 'string' ? TRANSITIONS[action] : undefined
  if (!transition || transition.from !== state) {
    return json({ error: 'invalid transition' }, 409)
  }
  orders.set(id, transition.to)
  return json({ id, state: transition.to })
}
