const MAX = 3
let counts = new Map<string, number>()

export function __reset(): void {
  counts = new Map<string, number>()
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const key = new URL(req.url).searchParams.get('key') ?? 'default'
  const current = counts.get(key) ?? 0
  if (current >= MAX) {
    return json({ error: 'rate limited' }, 429)
  }
  const next = current + 1
  counts.set(key, next)
  return json({ count: next })
}
