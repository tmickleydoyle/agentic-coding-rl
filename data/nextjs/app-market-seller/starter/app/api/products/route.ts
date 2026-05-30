import { createProduct, listProducts } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { products } applying ?inStock=true filter
  void req
  void listProducts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a product from { name, price?, stock? }; 400 if name blank
  void req
  void createProduct
  return json({ error: 'not implemented' }, 501)
}
