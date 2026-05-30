import {
  createKey,
  deleteKey,
  hasKey,
  listKeys,
  recordUsage,
  revokeKey,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { keys } (masked) applying ?status= and ?scope= filters
  void req
  void listKeys
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a key from { name, scopes? }; 400 if name blank
  void req
  void createKey
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= action revoke/use; 400 unknown action; 404 if absent
  void req
  void hasKey
  void revokeKey
  void recordUsage
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteKey
  return json({ error: 'not implemented' }, 501)
}
