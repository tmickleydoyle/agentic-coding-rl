interface Order {
  id: number
  state: string
  items: string[]
  history: string[]
}

let orders = new Map<number, Order>()

function seed(): Map<number, Order> {
  const m = new Map<number, Order>()
  m.set(1, { id: 1, state: 'draft', items: [], history: [] })
  m.set(2, { id: 2, state: 'submitted', items: ['widget'], history: [] })
  return m
}

export function __reset(): void {
  orders = seed()
}

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

// fromState -> action -> toState
const TRANSITIONS: Record<string, Record<string, string>> = {
  draft: { addItem: 'draft', submit: 'submitted' },
  submitted: { approve: 'approved', reject: 'draft' },
  approved: { fulfill: 'fulfilled' },
  fulfilled: {},
}

export async function GET(req: Request): Promise<Response> {
  const id = Number(new URL(req.url).searchParams.get('id'))
  const order = orders.get(id)
  if (!order) return json({ error: 'not found' }, 404)
  return json({ state: order.state, history: order.history })
}

export async function POST(req: Request): Promise<Response> {
  const id = Number(new URL(req.url).searchParams.get('id'))
  const order = orders.get(id)
  if (!order) return json({ error: 'not found' }, 404)

  const body = await readBody(req)
  const action = body.action

  if (typeof action !== 'string') {
    return json({ error: 'invalid transition' }, 409)
  }

  const allowed = TRANSITIONS[order.state] ?? {}
  if (!(action in allowed)) {
    return json({ error: 'invalid transition' }, 409)
  }
  const nextState = allowed[action]

  // Guards
  if (action === 'addItem') {
    const item = body.item
    if (typeof item !== 'string' || item.length === 0) {
      return json({ error: 'guard failed' }, 409)
    }
    order.items.push(item)
  } else if (action === 'submit') {
    if (order.items.length === 0) {
      return json({ error: 'guard failed' }, 409)
    }
  }

  order.state = nextState
  order.history.push(`${action}:${nextState}`)

  return json({
    id: order.id,
    state: order.state,
    items: order.items,
    history: order.history,
  })
}
