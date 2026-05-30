import {
  createSubscriber,
  deleteSubscriber,
  listSubscribers,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { subscribers } applying ?active= filter
  void req
  void listSubscribers
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an active subscriber from { email }; 400 if email blank/invalid
  void req
  void createSubscriber
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteSubscriber
  return json({ error: 'not implemented' }, 501)
}
