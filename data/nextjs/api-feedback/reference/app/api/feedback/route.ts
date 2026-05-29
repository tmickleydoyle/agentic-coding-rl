interface Feedback {
  rating: number
  comment?: string
}

let entries: Feedback[] = []

export function __reset(): void {
  entries = []
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function POST(req: Request): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const data = (body ?? {}) as { rating?: unknown; comment?: unknown }
  const rating = data.rating

  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: 'invalid rating' }, 400)
  }

  const entry: Feedback = { rating }
  if (typeof data.comment === 'string') entry.comment = data.comment
  entries.push(entry)
  return json({ ok: true }, 201)
}

export async function GET(_req: Request): Promise<Response> {
  const count = entries.length
  let average = 0
  if (count > 0) {
    const sum = entries.reduce((acc, e) => acc + e.rating, 0)
    average = Math.round((sum / count) * 10) / 10
  }
  return json({ count, average })
}
