import {
  createMatch,
  deleteMatch,
  listMatches,
  tallyOf,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(): Promise<Response> {
  // TODO: return { matches, tally }
  void listMatches
  void tallyOf
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: record a match; 400 bad result
  void req
  void createMatch
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete one (or all); 404 if absent
  void req
  void deleteMatch
  return json({ error: 'not implemented' }, 501)
}
