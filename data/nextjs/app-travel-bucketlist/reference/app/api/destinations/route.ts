import { createDestination, findDestination, listDestinations, updateVisited } from '../../../lib/store'

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
  const destinations = listDestinations({
    continent: params.get('continent'),
    visited: params.get('visited'),
  })
  return json({ destinations })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const continent = body.continent
  if (typeof continent !== 'string' || continent.trim().length === 0) {
    return json({ error: 'continent required' }, 400)
  }
  const country = typeof body.country === 'string' ? body.country.trim() : ''
  const notes = typeof body.notes === 'string' ? body.notes : ''
  const destination = createDestination({ name: name.trim(), country, continent: continent.trim(), notes })
  return json(destination, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findDestination(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const visited = typeof body.visited === 'boolean' ? body.visited : undefined
  const updated = updateVisited(id, visited)
  return json(updated)
}
