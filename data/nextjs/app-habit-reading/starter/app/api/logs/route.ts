import {
  deleteLog,
  listBooks,
  listLogs,
  toggleBook,
  upsertLog,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { logs, books }.
  void req
  void listLogs
  void listBooks
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: upsert a log from { date, pages }; 400 on bad date/pages.
  void req
  void upsertLog
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: toggle a book's done from { id }; 404 if absent.
  void req
  void toggleBook
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete a log; 404 if absent.
  void req
  void deleteLog
  return json({ error: 'not implemented' }, 501)
}
