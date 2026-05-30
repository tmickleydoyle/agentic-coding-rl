import {
  assignDay,
  createRoutine,
  deleteRoutine,
  findRoutine,
  listRoutines,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { routines }; support ?id= (404 if missing).
  void req
  void listRoutines
  void findRoutine
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a routine from { name, exerciseIds? }; 400 if name blank.
  void req
  void createRoutine
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= assign { day }; 404 if absent.
  void req
  void assignDay
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent.
  void req
  void deleteRoutine
  return json({ error: 'not implemented' }, 501)
}
