import { getTracks, addTrack, getQueue, addToQueue, removeFromQueue } from '../../../lib/store'

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  if (url.pathname.endsWith('/queue')) return Response.json({ queue: getQueue() })
  return Response.json({ tracks: getTracks() })
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const body = await req.json()
  if (url.pathname.endsWith('/queue')) {
    const { trackId } = body
    if (!trackId) return new Response(JSON.stringify({ error: 'Missing trackId' }), { status: 400 })
    return Response.json(addToQueue(trackId), { status: 201 })
  }
  const { title, artist, album, duration } = body
  if (!title) return new Response(JSON.stringify({ error: 'Missing title' }), { status: 400 })
  return Response.json(addTrack({ title, artist: artist ?? '', album: album ?? '', duration: Number(duration) || 0 }), { status: 201 })
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 })
  const ok = removeFromQueue(id)
  return Response.json({ success: ok })
}
