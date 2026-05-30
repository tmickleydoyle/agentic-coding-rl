import { createAccount, isKind, listAccounts } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(_req: Request): Promise<Response> {
  // TODO: return { accounts }
  void listAccounts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an account from { name, kind?, balance? }; 400 on blank name or invalid kind
  void req
  void createAccount
  void isKind
  return json({ error: 'not implemented' }, 501)
}
