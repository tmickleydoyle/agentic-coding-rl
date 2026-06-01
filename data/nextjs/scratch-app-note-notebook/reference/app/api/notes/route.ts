import {
  createNote,
  deleteNote,
  findNote,
  listNotes,
  updateNote,
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

const asTags = (v: unknown): string[] | undefined => {
  if (!Array.isArray(v)) return undefined
  return v.filter((x): x is string => typeof x === 'string')
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const notes = listNotes({
    notebookId: params.get('notebookId'),
    tag: params.get('tag'),
    q: params.get('q'),
  })
  return json({ notes })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const notebookId = typeof body.notebookId === 'string' ? body.notebookId : undefined
  const noteBody = typeof body.body === 'string' ? body.body : undefined
  const tags = asTags(body.tags)
  const note = createNote({ notebookId, title: title.trim(), body: noteBody, tags })
  return json(note, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findNote(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { title?: string; body?: string; tags?: string[]; pinned?: boolean } = {}
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.body === 'string') patch.body = body.body
  const tags = asTags(body.tags)
  if (tags) patch.tags = tags
  if (typeof body.pinned === 'boolean') patch.pinned = body.pinned
  if (Object.keys(patch).length === 0) patch.pinned = !existing.pinned // empty body => toggle pin
  const updated = updateNote(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteNote(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
