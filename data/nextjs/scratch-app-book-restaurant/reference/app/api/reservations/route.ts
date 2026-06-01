import {
  createReservation,
  deleteReservation,
  findTable,
  isReserved,
  listReservations,
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
  const reservations = listReservations({
    tableId: params.get('tableId'),
    time: params.get('time'),
  })
  return json({ reservations })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const tableId = body.tableId
  const time = body.time
  const name = body.name
  const party = body.party
  if (
    typeof tableId !== 'string' ||
    tableId.trim().length === 0 ||
    typeof time !== 'string' ||
    time.trim().length === 0 ||
    typeof name !== 'string' ||
    name.trim().length === 0 ||
    typeof party !== 'number' ||
    !Number.isFinite(party) ||
    party <= 0
  ) {
    return json({ error: 'invalid reservation' }, 400)
  }
  const table = findTable(tableId)
  if (!table || table.capacity < party) {
    return json({ error: 'over capacity' }, 422)
  }
  if (isReserved(tableId, time)) {
    return json({ error: 'table taken' }, 409)
  }
  const reservation = createReservation({ tableId, time, party, name: name.trim() })
  return json(reservation, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteReservation(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
