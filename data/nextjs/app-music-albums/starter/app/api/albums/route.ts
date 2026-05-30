import { createAlbum, deleteAlbum, findAlbum, listAlbums, updateAlbum } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { albums } applying ?artist=, ?favorite=, ?minRating= filters
  void req
  void listAlbums
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an album from { title, artist, year? }; 400 if title/artist blank
  void req
  void createAlbum
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch (clamp rating); 404 if absent
  void req
  void findAlbum
  void updateAlbum
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteAlbum
  return json({ error: 'not implemented' }, 501)
}
