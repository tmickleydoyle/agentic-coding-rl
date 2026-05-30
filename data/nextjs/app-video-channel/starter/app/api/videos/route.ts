import {
  channelVideos,
  findVideo,
  listVideos,
  recordView,
  sortVideos,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { videos }, { video } for ?id=, channel filter, or sort; 404 on unknown id
  void req
  void listVideos
  void findVideo
  void channelVideos
  void sortVideos
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: record a view for { id }; 400 missing, 404 unknown video
  void req
  void recordView
  return json({ error: 'not implemented' }, 501)
}
