import {
  addGoal,
  deleteGoal,
  listGoals,
  toggleMilestone,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { goals }.
  void req
  void listGoals
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a goal from { name, targetDate }; 400 on blanks.
  void req
  void addGoal
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: toggle { goalId, milestoneId }; 404 on missing goal/milestone.
  void req
  void toggleMilestone
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent.
  void req
  void deleteGoal
  return json({ error: 'not implemented' }, 501)
}
