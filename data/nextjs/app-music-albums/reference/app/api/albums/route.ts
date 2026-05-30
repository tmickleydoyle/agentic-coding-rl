import { createAlbum, deleteAlbum, findAlbum, listAlbums, updateAlbum } from '../../../lib/store'

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
  const albums = listAlbums({
    artist: params.get('artist'),
    favorite: params.get('favorite'),
    minRating: params.get('minRating'),
  })
  return json({ albums })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  const artist = body.artist
  if (
    typeof title !== 'string' ||
    title.trim().length === 0 ||
    typeof artist !== 'string' ||
    artist.trim().length === 0
  ) {
    return json({ error: 'title and artist required' }, 400)
  }
  const year = typeof body.year === 'number' ? body.year : undefined
  const album = createAlbum({ title: title.trim(), artist: artist.trim(), year })
  return json(album, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findAlbum(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: {
    title?: string
    artist?: string
    year?: number
    favorite?: boolean
    rating?: number
  } = {}
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.artist === 'string') patch.artist = body.artist
  if (typeof body.year === 'number') patch.year = body.year
  if (typeof body.favorite === 'boolean') patch.favorite = body.favorite
  if (typeof body.rating === 'number') patch.rating = body.rating
  const updated = updateAlbum(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteAlbum(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
