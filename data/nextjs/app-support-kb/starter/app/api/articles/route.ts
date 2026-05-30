import {
  createArticle,
  deleteArticle,
  findArticle,
  listArticles,
  updateArticle,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { articles } applying ?category= and ?q= filters
  void req
  void listArticles
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an article from { title, body?, category? }; 400 if title blank
  void req
  void createArticle
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= vote helpful/notHelpful or update fields; 404 if absent
  void req
  void findArticle
  void updateArticle
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteArticle
  return json({ error: 'not implemented' }, 501)
}
