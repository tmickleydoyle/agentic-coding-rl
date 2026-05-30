import { createEntry, deleteEntry, listEntries } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(): Promise<Response> {
  // TODO: return { entries } ranked by score descending
  void listEntries
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: add an entry; 400 name required / bad score
  void req
  void createEntry
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteEntry
  return json({ error: 'not implemented' }, 501)
}
