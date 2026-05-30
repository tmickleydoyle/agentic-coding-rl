import {
  createDeal,
  deleteDeal,
  findDeal,
  isStage,
  listDeals,
  stageRollup,
  updateDeal,
} from '../../../lib/store'
import type { Stage } from '../../../lib/types'

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
  if (params.get('rollup') === 'true') {
    return json({ rollup: stageRollup() })
  }
  const deals = listDeals({
    stage: params.get('stage'),
    contactId: params.get('contactId'),
  })
  return json({ deals })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const value = typeof body.value === 'number' ? body.value : undefined
  const stage = isStage(body.stage) ? (body.stage as Stage) : undefined
  const contactId = typeof body.contactId === 'string' ? body.contactId : undefined
  const deal = createDeal({ title: title.trim(), value, stage, contactId })
  return json(deal, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findDeal(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { stage?: Stage; value?: number; title?: string } = {}
  if (isStage(body.stage)) patch.stage = body.stage as Stage
  if (typeof body.value === 'number') patch.value = body.value
  if (typeof body.title === 'string') patch.title = body.title
  const updated = updateDeal(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteDeal(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
