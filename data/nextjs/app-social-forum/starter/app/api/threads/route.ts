import {
  createThread,
  deleteThread,
  findThread,
  listThreads,
  upvoteThread,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { threads } applying ?categoryId= and ?sort= (votes/recent)
  void req
  void listThreads
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a thread from { title, categoryId? }; 400 if title blank
  void req
  void createThread
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= upvote; 404 if absent
  void req
  void findThread
  void upvoteThread
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteThread
  return json({ error: 'not implemented' }, 501)
}
