import {
  cancelSubscription,
  createSubscription,
  deleteSubscription,
  findSubscription,
  listSubscriptions,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { subscriptions } applying ?active=true|false filter
  void req
  void listSubscriptions
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a subscription from { name, cost, cycle, nextRenewal }; 400 on blank name,
  // non-positive cost, or blank nextRenewal
  void req
  void createSubscription
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= cancel (active=false); 404 if absent
  void req
  void cancelSubscription
  void findSubscription
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteSubscription
  void findSubscription
  return json({ error: 'not implemented' }, 501)
}
