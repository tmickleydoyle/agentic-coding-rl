const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

export async function POST(req: Request): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const data = (body ?? {}) as { op?: unknown; a?: unknown; b?: unknown }
  const { op, a, b } = data

  if (!isNum(a) || !isNum(b)) {
    return json({ error: 'invalid operands' }, 400)
  }

  switch (op) {
    case 'add':
      return json({ result: a + b })
    case 'sub':
      return json({ result: a - b })
    case 'mul':
      return json({ result: a * b })
    case 'div':
      if (b === 0) return json({ error: 'division by zero' }, 400)
      return json({ result: a / b })
    default:
      return json({ error: 'unknown op' }, 400)
  }
}
