import { createPage, deletePage, findPage, listPages, updatePage } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { pages } applying ?range= and ?minViews= filters
  void req
  void listPages
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a page from { path, views?, sessions?, bounceRate? }; 400 if path blank
  void req
  void createPage
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set provided numeric fields; 404 if absent
  void req
  void findPage
  void updatePage
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deletePage
  return json({ error: 'not implemented' }, 501)
}
