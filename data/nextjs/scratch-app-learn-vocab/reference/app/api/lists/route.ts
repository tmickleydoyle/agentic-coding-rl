import { addWord, answerWord, findList, listLists } from '../../../lib/store'

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
  const id = new URL(req.url).searchParams.get('id')
  if (id) {
    const list = findList(id)
    if (!list) return json({ error: 'not found' }, 404)
    return json({ list })
  }
  return json({ lists: listLists() })
}

export async function POST(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findList(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const term = typeof body.term === 'string' ? body.term.trim() : ''
  const answer = typeof body.answer === 'string' ? body.answer.trim() : ''
  if (term.length === 0 || answer.length === 0) {
    return json({ error: 'term and answer required' }, 400)
  }
  const word = addWord(id, { term, answer })
  return json(word, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id') ?? ''
  const wordId = params.get('wordId') ?? ''
  const body = await readBody(req)
  const guess = typeof body.guess === 'string' ? body.guess : ''
  const result = answerWord(id, wordId, guess)
  if (!result) return json({ error: 'not found' }, 404)
  return json(result)
}
