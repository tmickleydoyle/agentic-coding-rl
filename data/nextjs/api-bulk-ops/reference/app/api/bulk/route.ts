interface Row {
  id: number
  value: number
}

let store = new Map<number, Row>()

function seed(): Map<number, Row> {
  const m = new Map<number, Row>()
  m.set(1, { id: 1, value: 10 })
  m.set(2, { id: 2, value: 20 })
  return m
}

export function __reset(): void {
  store = seed()
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

interface OpError {
  index: number
  message: string
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid body' }, 400)
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'invalid body' }, 400)
  }
  const ops = (body as Record<string, unknown>).ops
  if (!Array.isArray(ops) || ops.length === 0) {
    return json({ error: 'ops must be a non-empty array' }, 400)
  }

  // Project over a copy of the keyset to validate batch-aware conflicts.
  const exists = new Set<number>(store.keys())
  const errors: OpError[] = []

  ops.forEach((raw, index) => {
    if (!raw || typeof raw !== 'object') {
      errors.push({ index, message: 'unknown op' })
      return
    }
    const o = raw as Record<string, unknown>
    const op = o.op
    if (op !== 'create' && op !== 'update' && op !== 'delete') {
      errors.push({ index, message: 'unknown op' })
      return
    }
    if (!isNum(o.id)) {
      errors.push({ index, message: 'invalid id' })
      return
    }
    const id = o.id as number
    if (op === 'create' || op === 'update') {
      if (!isNum(o.value)) {
        errors.push({ index, message: 'invalid value' })
        return
      }
    }
    if (op === 'create') {
      if (exists.has(id)) {
        errors.push({ index, message: 'exists' })
        return
      }
      exists.add(id)
    } else {
      if (!exists.has(id)) {
        errors.push({ index, message: 'not found' })
        return
      }
      if (op === 'delete') exists.delete(id)
    }
  })

  if (errors.length > 0) return json({ errors }, 422)

  // All valid — apply for real, in order.
  ops.forEach((raw) => {
    const o = raw as Record<string, unknown>
    const op = o.op as string
    const id = o.id as number
    if (op === 'create' || op === 'update') {
      store.set(id, { id, value: o.value as number })
    } else {
      store.delete(id)
    }
  })

  const state: Record<string, Row> = {}
  Array.from(store.values())
    .sort((a, b) => a.id - b.id)
    .forEach((r) => {
      state[String(r.id)] = r
    })

  return json({ applied: ops.length, state })
}
