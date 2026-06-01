import {
  createPoll,
  deletePoll,
  findPoll,
  listPolls,
  votePoll,
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
  const sort = new URL(req.url).searchParams.get('sort')
  return json({ polls: listPolls({ sort }) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const question = body.question
  if (typeof question !== 'string' || question.trim().length === 0) {
    return json({ error: 'question required' }, 400)
  }
  const rawOptions = Array.isArray(body.options) ? body.options : []
  const options = rawOptions.filter((o): o is string => typeof o === 'string')
  const poll = createPoll({ question, options })
  if (!poll) return json({ error: 'two options required' }, 400)
  return json(poll, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id') ?? ''
  const optionId = params.get('optionId') ?? ''
  const result = votePoll(id, optionId)
  if (result.ok) return json(result.poll)
  if (result.code === 404) return json({ error: 'not found' }, 404)
  if (result.code === 409) return json({ error: 'already voted' }, 409)
  return json({ error: 'bad option' }, 400)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deletePoll(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
