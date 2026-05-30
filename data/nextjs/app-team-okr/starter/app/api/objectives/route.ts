import {
  createObjective,
  findObjective,
  objectivesWithProgress,
  setKeyResultProgress,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { objectives (each with progress), company }
  void req
  void objectivesWithProgress
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an objective from { title, owner? }; 400 if title blank
  void req
  void createObjective
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id=&kr= set the key result progress (clamped); 404 if objective or kr absent
  void req
  void findObjective
  void setKeyResultProgress
  return json({ error: 'not implemented' }, 501)
}
