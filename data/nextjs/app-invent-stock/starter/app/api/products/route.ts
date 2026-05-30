import { adjustProduct, createProduct, findProduct, listProducts } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { products } applying an optional ?low=true filter
  void req
  void listProducts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a product from { name, qty, reorderPoint }; 400 on bad fields
  void req
  void createProduct
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= adjust qty by { delta }; 400 on bad delta; 404 if absent
  void req
  void findProduct
  void adjustProduct
  return json({ error: 'not implemented' }, 501)
}
