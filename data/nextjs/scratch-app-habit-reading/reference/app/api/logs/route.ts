import {
  deleteLog,
  listBooks,
  listLogs,
  toggleBook,
  upsertLog,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

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
  return json({ logs: listLogs(), books: listBooks() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const date = body.date
  const pages = body.pages
  if (typeof date !== 'string' || date.trim().length === 0) {
    return json({ error: 'date required' }, 400)
  }
  if (typeof pages !== 'number' || Number.isNaN(pages) || pages < 0) {
    return json({ error: 'pages invalid' }, 400)
  }
  const log = upsertLog({ date, pages })
  return json(log, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const body = await readBody(req)
  const id = typeof body.id === 'string' ? body.id : ''
  const book = toggleBook(id)
  if (!book) return json({ error: 'not found' }, 404)
  return json(book)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteLog(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
