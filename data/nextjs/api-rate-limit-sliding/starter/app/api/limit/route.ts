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
  // TODO: sliding window: drop old timestamps, allow/deny, return remaining or retryAfter
  void req
  void log
  void now
  void LIMIT
  void WINDOW
  return json({ error: 'not implemented' }, 501)
}
