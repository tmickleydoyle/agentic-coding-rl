import {
  createInvoice,
  deleteInvoice,
  findInvoice,
  listInvoices,
  updateInvoice,
} from '../../../lib/store'
import type { InvoiceStatus } from '../../../lib/types'

export { __reset } from '../../../lib/store'

const VALID: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue']

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
  const invoices = listInvoices({
    status: params.get('status'),
    clientId: params.get('clientId'),
  })
  return json({ invoices })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const amount = body.amount
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return json({ error: 'amount required' }, 400)
  }
  const clientId = typeof body.clientId === 'string' ? body.clientId : undefined
  const dueDate = typeof body.dueDate === 'string' ? body.dueDate : undefined
  const status =
    typeof body.status === 'string' && VALID.includes(body.status as InvoiceStatus)
      ? (body.status as InvoiceStatus)
      : undefined
  const invoice = createInvoice({ clientId, amount, dueDate, status })
  return json(invoice, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findInvoice(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const status =
    typeof body.status === 'string' && VALID.includes(body.status as InvoiceStatus)
      ? (body.status as InvoiceStatus)
      : 'paid'
  const updated = updateInvoice(id, { status })
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteInvoice(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
