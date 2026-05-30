import { deleteEntry, listEntries, upsertEntry } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { entries }.
  void req
  void listEntries
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: upsert { date, score, triggers? }; 400 on bad date/score.
  void req
  void upsertEntry
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent.
  void req
  void deleteEntry
  return json({ error: 'not implemented' }, 501)
}
