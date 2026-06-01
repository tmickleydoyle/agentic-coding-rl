import {
  createAppointment,
  deleteAppointment,
  findProvider,
  isSlotTaken,
  listAppointments,
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
  const appointments = listAppointments({
    providerId: params.get('providerId'),
    when: params.get('when'),
  })
  return json({ appointments })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const providerId = body.providerId
  const date = body.date
  const patient = body.patient
  if (
    typeof providerId !== 'string' ||
    providerId.trim().length === 0 ||
    typeof date !== 'string' ||
    date.trim().length === 0 ||
    typeof patient !== 'string' ||
    patient.trim().length === 0
  ) {
    return json({ error: 'invalid appointment' }, 400)
  }
  const provider = findProvider(providerId)
  if (!provider || !provider.slots.includes(date)) {
    return json({ error: 'slot unavailable' }, 422)
  }
  if (isSlotTaken(providerId, date)) {
    return json({ error: 'slot taken' }, 409)
  }
  const appointment = createAppointment({ providerId, date, patient: patient.trim() })
  return json(appointment, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteAppointment(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
