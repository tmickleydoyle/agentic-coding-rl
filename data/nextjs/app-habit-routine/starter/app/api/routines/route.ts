import {
  addRoutine,
  deleteRoutine,
  listRoutines,
  toggleStep,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { routines }.
  void req
  void listRoutines
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a routine from { name, kind }; 400 on blank name.
  void req
  void addRoutine
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: toggle { routineId, stepId } + recompute completion; 404 on missing routine/step.
  void req
  void toggleStep
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent.
  void req
  void deleteRoutine
  return json({ error: 'not implemented' }, 501)
}
