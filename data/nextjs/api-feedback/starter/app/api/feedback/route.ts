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
  // TODO: validate rating integer 1..5, store; 400 otherwise
  void req
  void entries
  return json({ error: 'not implemented' }, 501)
}

export async function GET(req: Request): Promise<Response> {
  // TODO: return { count, average } (avg rounded to 1 decimal, 0 when empty)
  void req
  return json({ error: 'not implemented' }, 501)
}
