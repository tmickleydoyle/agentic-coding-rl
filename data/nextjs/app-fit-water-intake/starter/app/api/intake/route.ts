import {
  createDrink,
  deleteDrink,
  getGoal,
  getReminders,
  listDrinks,
  setGoal,
  setReminders,
  totalForDate,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { drinks, goal, reminders }; support ?date= (day total).
  void req
  void listDrinks
  void getGoal
  void getReminders
  void totalForDate
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a drink from { amount, date? }; 400 on bad amount.
  void req
  void createDrink
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: update { goal?, reminders? }; 400 on invalid values.
  void req
  void setGoal
  void setReminders
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent.
  void req
  void deleteDrink
  return json({ error: 'not implemented' }, 501)
}
