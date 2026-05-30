import {
  createSession,
  deleteSession,
  isValidSlot,
  listSessions,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { sessions } applying ?track= and ?slot= filters
  void req
  void listSessions
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a session; 400 invalid, 422 bad slot
  void req
  void createSession
  void isValidSlot
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteSession
  return json({ error: 'not implemented' }, 501)
}
