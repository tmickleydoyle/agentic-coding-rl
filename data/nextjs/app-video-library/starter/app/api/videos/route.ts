import {
  clearWatched,
  findVideo,
  listVideos,
  listWatched,
  markWatched,
  videosByCategory,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { videos }, { video } for ?id=, or category filter; 404 on unknown id
  void req
  void listVideos
  void findVideo
  void videosByCategory
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: mark { id } watched; 400 missing, 404 unknown video
  void req
  void findVideo
  void markWatched
  void listWatched
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: clear ?id= from watched; 404 if not watched
  void req
  void clearWatched
  return json({ error: 'not implemented' }, 501)
}
