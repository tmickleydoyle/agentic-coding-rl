import {
  addHabit,
  deleteHabit,
  listHabits,
  toggleDate,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { habits }.
  void req
  void listHabits
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a habit from { name }; 400 on blank name.
  void req
  void addHabit
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: toggle { id, date }; 404 unknown id, 400 blank date.
  void req
  void toggleDate
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent.
  void req
  void deleteHabit
  return json({ error: 'not implemented' }, 501)
}
