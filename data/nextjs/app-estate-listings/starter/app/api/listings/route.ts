import {
  createProperty,
  deleteProperty,
  findProperty,
  listProperties,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: ?id= returns one property (404 if absent); otherwise { properties } applying
  // ?type=, ?minBeds=, ?maxPrice= filters
  void req
  void listProperties
  void findProperty
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a property from { address, type?, price?, beds?, baths? }; 400 if address blank
  void req
  void createProperty
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteProperty
  return json({ error: 'not implemented' }, 501)
}
