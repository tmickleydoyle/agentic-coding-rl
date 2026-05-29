interface Todo {
  id: number
  text: string
  done: boolean
}

let todos: Todo[] = []
let nextId = 1

export function __reset(): void {
  todos = []
  nextId = 1
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return all todos
  void req
  void todos
  void nextId
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create todo from { text }; 400 if missing
  void req
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: set done by ?id; 404 if absent
  void req
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: remove by ?id; 404 if absent
  void req
  return json({ error: 'not implemented' }, 501)
}
