import { createSong, deleteSong, findSong, listSongs, updateSong } from '../../../lib/store'

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
  const songs = listSongs({
    genre: params.get('genre'),
    artist: params.get('artist'),
    q: params.get('q'),
  })
  return json({ songs })
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
  const genre = typeof body.genre === 'string' ? body.genre : undefined
  const durationSec = typeof body.durationSec === 'number' ? body.durationSec : undefined
  const song = createSong({ title: title.trim(), artist: artist.trim(), genre, durationSec })
  return json(song, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findSong(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const patch: {
    title?: string
    artist?: string
    genre?: string
    durationSec?: number
    play?: boolean
  } = {}
  if (typeof body.title === 'string') patch.title = body.title
  if (typeof body.artist === 'string') patch.artist = body.artist
  if (typeof body.genre === 'string') patch.genre = body.genre
  if (typeof body.durationSec === 'number') patch.durationSec = body.durationSec
  if (body.play === true) patch.play = true
  const updated = updateSong(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteSong(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
