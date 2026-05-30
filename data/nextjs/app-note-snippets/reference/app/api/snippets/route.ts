import {
  createSnippet,
  deleteSnippet,
  findSnippet,
  listSnippets,
  updateSnippet,
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

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const snippets = listSnippets({
    language: params.get('language'),
    favorite: params.get('favorite'),
    q: params.get('q'),
  })
  return json({ snippets })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  const language = body.language
  if (
    typeof title !== 'string' ||
    title.trim().length === 0 ||
    typeof language !== 'string' ||
    language.trim().length === 0
  ) {
    return json({ error: 'title and language required' }, 400)
  }
  const code = typeof body.code === 'string' ? body.code : undefined
  const snippet = createSnippet({ title: title.trim(), language: language.trim(), code })
  return json(snippet, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findSnippet(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: {
    title?: string
    language?: string
    code?: string
    favorite?: boolean
    copy?: boolean
  } = {}
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.language === 'string') patch.language = body.language
  if (typeof body.code === 'string') patch.code = body.code
  if (typeof body.favorite === 'boolean') patch.favorite = body.favorite
  if (body.copy === true) patch.copy = true
  const updated = updateSnippet(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteSnippet(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
