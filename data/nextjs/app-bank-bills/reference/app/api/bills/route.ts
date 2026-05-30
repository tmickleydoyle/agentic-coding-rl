import { createBill, listBills, updateBill } from '../../../lib/store'

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
  const unpaid = new URL(req.url).searchParams.get('unpaid') === 'true'
  return json({ bills: listBills({ unpaid }) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return json({ error: 'amount must be positive' }, 400)
  }
  const dueDay = body.dueDay
  if (
    typeof dueDay !== 'number' ||
    !Number.isInteger(dueDay) ||
    dueDay < 1 ||
    dueDay > 31
  ) {
    return json({ error: 'invalid due day' }, 400)
  }
  const autopay = body.autopay === true
  const bill = createBill({ name: name.trim(), amount, dueDay, autopay })
  return json(bill, 201)
}

export async function PATCH(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const body = await readBody(req)
  const patch: { paid?: boolean; autopay?: boolean } = {}
  if (typeof body.paid === 'boolean') patch.paid = body.paid
  if (typeof body.autopay === 'boolean') patch.autopay = body.autopay
  const bill = updateBill(id, patch)
  if (!bill) return json({ error: 'not found' }, 404)
  return json(bill)
}
