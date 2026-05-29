interface Doc {
  id: number
  title: string
  body: string
}

const SEED: Doc[] = [
  { id: 1, title: 'apple banana', body: 'fruit basket with apple' },
  { id: 2, title: 'banana split', body: 'banana banana cream' },
  { id: 3, title: 'cherry pie', body: 'apple and cherry filling' },
  { id: 4, title: 'date night', body: 'plain text here' },
]

let docs: Doc[] = SEED.map((d) => ({ ...d }))

export function __reset(): void {
  docs = SEED.map((d) => ({ ...d }))
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: parse q/page/limit, score docs, sort, paginate
  void req
  void docs
  return json({ error: 'not implemented' }, 501)
}
