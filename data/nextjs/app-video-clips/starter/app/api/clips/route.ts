import { clipsByCategory, findClip, likeClip, listClips } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { clips }, { clip } for ?id=, or category filter; 404 on unknown id
  void req
  void listClips
  void findClip
  void clipsByCategory
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: like a clip from { id }; 400 missing, 404 unknown clip
  void req
  void likeClip
  return json({ error: 'not implemented' }, 501)
}
