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

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function GET(_req: Request): Promise<Response> {
  return json({ todos })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const text = body.text
  if (typeof text !== 'string' || text.length === 0) {
    return json({ error: 'text required' }, 400)
  }
  const todo: Todo = { id: nextId++, text, done: false }
  todos.push(todo)
  return json(todo, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = Number(new URL(req.url).searchParams.get('id'))
  const todo = todos.find((t) => t.id === id)
  if (!todo) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  todo.done = Boolean(body.done)
  return json(todo)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = Number(new URL(req.url).searchParams.get('id'))
  const idx = todos.findIndex((t) => t.id === id)
  if (idx === -1) return json({ error: 'not found' }, 404)
  todos.splice(idx, 1)
  return json({ ok: true })
}
