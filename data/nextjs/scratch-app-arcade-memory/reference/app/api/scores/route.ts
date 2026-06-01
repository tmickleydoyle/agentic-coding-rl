import { bestOf, createRun, deleteRun, listRuns } from '../../../lib/store'

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
  const runs = listRuns()
  return json({ runs, best: bestOf(runs) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const run = createRun(body.moves)
  if (!run) return json({ error: 'bad moves' }, 400)
  return json(run, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteRun(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
