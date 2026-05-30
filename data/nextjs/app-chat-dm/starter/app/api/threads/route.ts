import {
  createThread,
  deleteThread,
  findThread,
  listThreads,
  setUnread,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { threads } applying an optional ?unread=true filter
  void req
  void listThreads
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a thread from { personId }; 400 on blank personId
  void req
  void createThread
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set/toggle unread; 404 if absent
  void req
  void findThread
  void setUnread
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteThread
  return json({ error: 'not implemented' }, 501)
}
