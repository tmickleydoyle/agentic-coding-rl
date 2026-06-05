import {
  createQuote,
  findQuote,
  isStatus,
  listQuotes,
  setQuoteStatus,
} from '../../../lib/store'
import type { LineItem } from '../../../lib/types'

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

function parseItems(value: unknown): LineItem[] {
  if (!Array.isArray(value)) return []
  return value.map((raw) => {
    const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
    return {
      description: typeof r.description === 'string' ? r.description : '',
      qty: typeof r.qty === 'number' && Number.isFinite(r.qty) ? r.qty : 0,
      price: typeof r.price === 'number' && Number.isFinite(r.price) ? r.price : 0,
    }
  })
}

export async function GET(req: Request): Promise<Response> {
  const status = new URL(req.url).searchParams.get('status')
  return json({ quotes: listQuotes(status) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const client = body.client
  if (typeof client !== 'string' || client.trim().length === 0) {
    return json({ error: 'client required' }, 400)
  }
  const quote = createQuote({ client: client.trim(), items: parseItems(body.items) })
  return json(quote, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findQuote(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (!isStatus(body.status)) return json({ error: 'invalid status' }, 400)
  const updated = setQuoteStatus(id, body.status)
  return json(updated)
}
