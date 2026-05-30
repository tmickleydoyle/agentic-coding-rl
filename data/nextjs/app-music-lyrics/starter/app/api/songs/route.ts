import { createSong, deleteSong, findSong, listSongs, updateSong } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { songs } applying ?artist=, ?q= filters
  void req
  void listSongs
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a song from { title, artist, lines? }; 400 if title/artist blank
  void req
  void createSong
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch; 404 if absent
  void req
  void findSong
  void updateSong
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteSong
  return json({ error: 'not implemented' }, 501)
}
