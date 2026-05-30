import { createBin, findBin, listBins, moveBetween } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { bins } applying an optional ?available=true filter
  void req
  void listBins
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a bin from { code, capacity }; 400 on bad fields
  void req
  void createBin
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: move items via { from, to, name, qty }; 400/404/409 per spec; { bins } on success
  void req
  void findBin
  void moveBetween
  return json({ error: 'not implemented' }, 501)
}
