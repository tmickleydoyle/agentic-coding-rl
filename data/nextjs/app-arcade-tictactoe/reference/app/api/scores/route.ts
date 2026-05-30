import {
  createMatch,
  deleteMatch,
  listMatches,
  tallyOf,
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

export async function GET(): Promise<Response> {
  const matches = listMatches()
  return json({ matches, tally: tallyOf(matches) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const match = createMatch(body.result)
  if (!match) return json({ error: 'bad result' }, 400)
  return json(match, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteMatch(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
