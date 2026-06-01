import {
  createStation,
  deleteStation,
  findStation,
  listStations,
  updateStation,
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
  const stations = listStations({
    genre: params.get('genre'),
    favorite: params.get('favorite'),
    minBitrate: params.get('minBitrate'),
  })
  return json({ stations })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const genre = typeof body.genre === 'string' ? body.genre : undefined
  const bitrate = typeof body.bitrate === 'number' ? body.bitrate : undefined
  const station = createStation({ name: name.trim(), genre, bitrate })
  return json(station, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findStation(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: {
    name?: string
    genre?: string
    bitrate?: number
    favorite?: boolean
    play?: boolean
  } = {}
  if (typeof body.name === 'string') patch.name = body.name
  if (typeof body.genre === 'string') patch.genre = body.genre
  if (typeof body.bitrate === 'number') patch.bitrate = body.bitrate
  if (typeof body.favorite === 'boolean') patch.favorite = body.favorite
  if (body.play === true) patch.play = true
  const updated = updateStation(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteStation(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
