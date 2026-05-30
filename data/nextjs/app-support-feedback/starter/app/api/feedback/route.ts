import { createFeedback, isSentiment, isStatus, listFeedback, setStatus } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { feedback } applying ?category= and ?status= filters
  void req
  void listFeedback
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create feedback from { author, message, ... }; 400 if author/message blank
  void req
  void createFeedback
  void isSentiment
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= body { status } updates status; 400 invalid, 404 absent
  void req
  void setStatus
  void isStatus
  return json({ error: 'not implemented' }, 501)
}
