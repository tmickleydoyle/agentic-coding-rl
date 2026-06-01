import { createAccount, isKind, listAccounts } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function GET(_req: Request): Promise<Response> {
  return json({ accounts: listAccounts() })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  let kind: 'checking' | 'savings' = 'checking'
  if (body.kind !== undefined) {
    if (!isKind(body.kind)) return json({ error: 'invalid kind' }, 400)
    kind = body.kind
  }
  const balance =
    typeof body.balance === 'number' && body.balance >= 0 ? body.balance : 0
  const account = createAccount({ name: name.trim(), kind, balance })
  return json(account, 201)
}
