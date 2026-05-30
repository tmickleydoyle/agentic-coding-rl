import {
  createEntry,
  deleteEntry,
  getGoal,
  latestEntry,
  listEntries,
  setGoal,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { entries, goal }; support ?latest (404 when none).
  void req
  void listEntries
  void getGoal
  void latestEntry
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an entry from { date, weight }; 400 on bad date/weight.
  void req
  void createEntry
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: set the goal from { goal }; 400 if non-positive.
  void req
  void setGoal
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent.
  void req
  void deleteEntry
  return json({ error: 'not implemented' }, 501)
}
