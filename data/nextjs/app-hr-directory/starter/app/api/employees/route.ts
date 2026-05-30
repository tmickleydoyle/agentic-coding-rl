import { createEmployee, listEmployees } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { employees } applying ?q= and ?department= filters
  void req
  void listEmployees
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an employee from { name, title, department?, ... }; 400 if name/title blank
  void req
  void createEmployee
  return json({ error: 'not implemented' }, 501)
}
