import { createShow, deleteShow, findShow, listShows, updateShow } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { shows } applying ?category=, ?subscribed= filters
  void req
  void listShows
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a show from { title, category? }; 400 if title blank
  void req
  void createShow
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch (subscribe sets subscribed); 404 if absent
  void req
  void findShow
  void updateShow
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteShow
  return json({ error: 'not implemented' }, 501)
}
