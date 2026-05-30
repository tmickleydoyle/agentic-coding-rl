import {
  createPost,
  deletePost,
  findPost,
  listPosts,
  setLiked,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { posts } applying an optional ?authorId= filter
  void req
  void listPosts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a post from { authorId, text }; 400 on blank authorId/text
  void req
  void createPost
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set/toggle like; 404 if absent
  void req
  void findPost
  void setLiked
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deletePost
  return json({ error: 'not implemented' }, 501)
}
