import {
  addMessage,
  assignSession,
  closeSession,
  createSession,
  deleteSession,
  findSession,
  listSessions,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { sessions } applying the ?status= filter
  void req
  void listSessions
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a waiting session from { visitor, topic? }; 400 if visitor blank
  void req
  void createSession
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= with action assign/close/message; 404 if absent
  void req
  void findSession
  void assignSession
  void closeSession
  void addMessage
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteSession
  return json({ error: 'not implemented' }, 501)
}
