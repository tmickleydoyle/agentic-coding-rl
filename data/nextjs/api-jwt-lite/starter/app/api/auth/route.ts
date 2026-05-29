const SECRET = 'acrl-secret'
const TTL = 60000

let pinnedNow: number | null = null

export function __setNow(ms: number): void {
  pinnedNow = ms
}

export function __reset(): void {
  pinnedNow = null
}

function now(): number {
  return pinnedNow === null ? Date.now() : pinnedNow
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export function signingHash(input: string): string {
  // TODO: implement djb2-xor rolling hash, return base-36
  void input
  return ''
}

export async function POST(req: Request): Promise<Response> {
  // TODO: validate { user }, issue token
  void req
  return json({ error: 'not implemented' }, 501)
}

export async function GET(req: Request): Promise<Response> {
  // TODO: read Bearer token, verify sig + exp
  void req
  void SECRET
  void TTL
  void now
  return json({ error: 'not implemented' }, 501)
}
