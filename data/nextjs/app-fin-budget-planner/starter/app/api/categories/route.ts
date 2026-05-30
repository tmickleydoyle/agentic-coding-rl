import { createCategory, listCategories } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { categories }
  void req
  void listCategories
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a category from { name, planned? }; 400 if name blank
  void req
  void createCategory
  return json({ error: 'not implemented' }, 501)
}
