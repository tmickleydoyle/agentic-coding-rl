import { listEvents } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id')
  const events = listEvents(id)
  return json({ events })
}
