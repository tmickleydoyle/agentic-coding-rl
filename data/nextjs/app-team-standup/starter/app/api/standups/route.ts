import { createEntry, deleteEntry, listEntries } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { entries } applying ?date=, ?memberId=, ?blockers=true filters
  void req
  void listEntries
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an entry from { memberId, date?, yesterday, today, blocker? };
  // 400 if yesterday/today blank
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
