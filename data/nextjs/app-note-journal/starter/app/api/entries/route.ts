import {
  createEntry,
  deleteEntry,
  findEntry,
  listEntries,
  summary,
  updateEntry,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { entries } applying ?mood= and ?date= filters; ?summary=1 => { summary }
  void req
  void listEntries
  void summary
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an entry from { body, mood?, date? }; 400 if body blank
  void req
  void createEntry
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch body/mood; 404 if absent
  void req
  void findEntry
  void updateEntry
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteEntry
  return json({ error: 'not implemented' }, 501)
}
