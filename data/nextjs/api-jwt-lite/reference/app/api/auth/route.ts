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
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = ((h * 33) ^ input.charCodeAt(i)) >>> 0
  }
  return (h >>> 0).toString(36)
}

function sign(b64Header: string, b64Payload: string): string {
  return signingHash(b64Header + '.' + b64Payload + SECRET)
}

interface Payload {
  user: string
  exp: number
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = null
  }
  const user =
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).user
      : undefined
  if (typeof user !== 'string' || user.length === 0) {
    return json({ error: 'user required' }, 400)
  }
  const header = btoa(JSON.stringify({ alg: 'HS-lite', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ user, exp: now() + TTL }))
  const token = `${header}.${payload}.${sign(header, payload)}`
  return json({ token })
}

export async function GET(req: Request): Promise<Response> {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return json({ error: 'missing token' }, 401)
  }
  const token = auth.slice('Bearer '.length)
  const parts = token.split('.')
  if (parts.length !== 3) return json({ error: 'invalid token' }, 401)
  const [b64Header, b64Payload, sig] = parts
  if (sign(b64Header, b64Payload) !== sig) {
    return json({ error: 'invalid token' }, 401)
  }
  let payload: Payload
  try {
    const parsed = JSON.parse(atob(b64Payload)) as unknown
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as Payload).user !== 'string' ||
      typeof (parsed as Payload).exp !== 'number'
    ) {
      return json({ error: 'invalid token' }, 401)
    }
    payload = parsed as Payload
  } catch {
    return json({ error: 'invalid token' }, 401)
  }
  if (payload.exp <= now()) return json({ error: 'expired' }, 401)
  return json({ user: payload.user })
}
