import { listAudit } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { audit } newest first, optionally filtered by ?flagId=
  void req
  void listAudit
  return json({ error: 'not implemented' }, 501)
}
