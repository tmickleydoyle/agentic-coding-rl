import { listEvents } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { events } applying an optional ?id= filter
  void req
  void listEvents
  return json({ error: 'not implemented' }, 501)
}
