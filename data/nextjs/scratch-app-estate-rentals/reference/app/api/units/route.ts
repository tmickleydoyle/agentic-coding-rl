import { findUnit, listUnits, occupancyRate, updateUnit } from '../../../lib/store'

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
  const occupiedParam = new URL(req.url).searchParams.get('occupied')
  const occupied =
    occupiedParam === 'true' ? true : occupiedParam === 'false' ? false : null
  return json({ units: listUnits(occupied), occupancyRate: occupancyRate() })
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findUnit(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: { occupied?: boolean } = {}
  if (typeof body.occupied === 'boolean') patch.occupied = body.occupied
  else patch.occupied = !existing.occupied
  const updated = updateUnit(id, patch)
  return json(updated)
}
