import {
  createParty,
  deleteParty,
  filterParties,
  findParty,
  listParties,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { parties }, { party } for ?id=, or filter; 404 on unknown id
  void req
  void listParties
  void findParty
  void filterParties
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create from { title, time }; 400 missing title / non-numeric time
  void req
  void createParty
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: remove ?id= party; 404 if unknown
  void req
  void deleteParty
  return json({ error: 'not implemented' }, 501)
}
