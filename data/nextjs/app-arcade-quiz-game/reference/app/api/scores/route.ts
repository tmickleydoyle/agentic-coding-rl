import { createEntry, deleteEntry, listEntries } from '../../../lib/store'

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

export async function GET(): Promise<Response> {
  return json({ entries: listEntries() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const result = createEntry({ name: body.name, score: body.score })
  if (!result.ok) return json({ error: result.error }, 400)
  return json(result.entry, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEntry(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
