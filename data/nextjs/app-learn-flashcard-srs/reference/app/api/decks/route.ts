import {
  addCard,
  dueCards,
  findDeck,
  gradeCard,
  listDecks,
} from '../../../lib/store'
import type { Grade } from '../../../lib/types'

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
  const id = params.get('id')
  if (id) {
    const deck = findDeck(id)
    if (!deck) return json({ error: 'not found' }, 404)
    if (params.get('due') === '1') return json({ cards: dueCards(deck) })
    return json({ deck })
  }
  return json({ decks: listDecks() })
}

export async function POST(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findDeck(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const front = typeof body.front === 'string' ? body.front.trim() : ''
  const back = typeof body.back === 'string' ? body.back.trim() : ''
  if (front.length === 0 || back.length === 0) {
    return json({ error: 'front and back required' }, 400)
  }
  const card = addCard(id, { front, back })
  return json(card, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id') ?? ''
  const cardId = params.get('cardId') ?? ''
  if (!findDeck(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const grade = body.grade
  if (grade !== 'easy' && grade !== 'hard') {
    return json({ error: 'invalid grade' }, 400)
  }
  const updated = gradeCard(id, cardId, grade as Grade)
  if (!updated) return json({ error: 'not found' }, 404)
  return json(updated)
}
