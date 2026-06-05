import {
  createBooking,
  deleteBooking,
  isSlotTaken,
  listBookings,
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
  const params = new URL(req.url).searchParams
  const bookings = listBookings({
    serviceId: params.get('serviceId'),
    slot: params.get('slot'),
  })
  return json({ bookings })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const serviceId = body.serviceId
  const slot = body.slot
  const customer = body.customer
  if (
    typeof serviceId !== 'string' ||
    serviceId.trim().length === 0 ||
    typeof slot !== 'string' ||
    slot.trim().length === 0 ||
    typeof customer !== 'string' ||
    customer.trim().length === 0
  ) {
    return json({ error: 'invalid booking' }, 400)
  }
  if (isSlotTaken(serviceId, slot)) {
    return json({ error: 'slot taken' }, 409)
  }
  const booking = createBooking({ serviceId, slot, customer: customer.trim() })
  return json(booking, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteBooking(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
