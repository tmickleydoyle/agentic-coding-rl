import {
  createPost,
  deletePost,
  findPost,
  listPosts,
  updatePost,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { posts } applying ?status= and ?categoryId= filters
  void req
  void listPosts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a post from { title, body?, categoryId?, status? }; 400 if title blank
  void req
  void createPost
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= toggle/update status+fields; 404 if absent
  void req
  void findPost
  void updatePost
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deletePost
  return json({ error: 'not implemented' }, 501)
}
