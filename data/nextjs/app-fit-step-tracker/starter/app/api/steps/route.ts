import {
  deleteEntry,
  getGoal,
  listEntries,
  setGoal,
  upsertEntry,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { entries, goal }.
  void req
  void listEntries
  void getGoal
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: upsert an entry from { date, steps }; 400 on bad date/steps.
  void req
  void upsertEntry
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
