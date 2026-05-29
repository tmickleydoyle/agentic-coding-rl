const LIMIT = 3
const WINDOW = 1000

let log = new Map<string, number[]>()
let pinnedNow: number | null = null

export function __reset(): void {
  log = new Map<string, number[]>()
  pinnedNow = null
}

export function __setNow(ms: number): void {
  pinnedNow = ms
}

function now(): number {
  return pinnedNow === null ? Date.now() : pinnedNow
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const key = new URL(req.url).searchParams.get('key')
  if (!key) return json({ error: 'key required' }, 400)

  const t = now()
  const cutoff = t - WINDOW
  const prev = log.get(key) ?? []
  const fresh = prev.filter((ts) => ts > cutoff)

  if (fresh.length < LIMIT) {
    fresh.push(t)
    log.set(key, fresh)
    return json({ remaining: LIMIT - fresh.length })
  }

  log.set(key, fresh)
  const oldest = fresh[0]
  const retryAfter = oldest + WINDOW - t
  return json({ retryAfter }, 429)
}
