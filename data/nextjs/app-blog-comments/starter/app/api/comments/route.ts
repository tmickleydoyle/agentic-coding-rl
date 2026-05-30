import {
  createComment,
  deleteComment,
  findComment,
  listComments,
  updateComment,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { comments } applying ?status= and ?postId= filters
  void req
  void listComments
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a comment from { postId, author, body? }; 400 if postId/author blank
  void req
  void createComment
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set { status }; 400 if status missing/invalid; 404 if absent
  void req
  void findComment
  void updateComment
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteComment
  return json({ error: 'not implemented' }, 501)
}
