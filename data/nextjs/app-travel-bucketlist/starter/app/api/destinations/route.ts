export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export async function GET(_req: Request): Promise<Response> {
  // TODO: list destinations honoring ?continent= and ?visited= filters
  return json({ destinations: [] })
}

export async function POST(_req: Request): Promise<Response> {
  // TODO: validate name+continent, create destination, return 201 (400 on bad input)
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(_req: Request): Promise<Response> {
  // TODO: update visited by ?id= (404 if missing)
  return json({ error: 'not implemented' }, 501)
}
