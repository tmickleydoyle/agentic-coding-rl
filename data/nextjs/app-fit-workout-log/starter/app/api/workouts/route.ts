import {
  createWorkout,
  deleteWorkout,
  findWorkout,
  listWorkouts,
  recordFor,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { workouts }; support ?id= (404) and ?record=<exerciseId>.
  void req
  void listWorkouts
  void findWorkout
  void recordFor
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a workout from { name, date?, exercises? }; 400 if name blank.
  void req
  void createWorkout
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent.
  void req
  void deleteWorkout
  return json({ error: 'not implemented' }, 501)
}
