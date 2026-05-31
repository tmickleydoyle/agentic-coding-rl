export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export async function GET(_req: Request): Promise<Response> {
  return json({ pots: [] }) // TODO: list pots
}
export async function POST(_req: Request): Promise<Response> {
  return json({ error: 'not implemented' }, 501) // TODO: create pot (validate name)
}
export async function PATCH(_req: Request): Promise<Response> {
  return json({ error: 'not implemented' }, 501) // TODO: update pot by ?id=
}
export async function DELETE(_req: Request): Promise<Response> {
  return json({ error: 'not implemented' }, 501) // TODO: delete pot by ?id=
}
