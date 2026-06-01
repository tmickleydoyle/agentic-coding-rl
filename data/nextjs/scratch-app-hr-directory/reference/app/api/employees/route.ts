import { createEmployee, listEmployees } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const employees = listEmployees({
    q: params.get('q'),
    department: params.get('department'),
  })
  return json({ employees })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const department = typeof body.department === 'string' && body.department.trim().length > 0 ? body.department.trim() : 'Unassigned'
  const email = typeof body.email === 'string' ? body.email : ''
  const managerId = typeof body.managerId === 'string' ? body.managerId : null
  const employee = createEmployee({ name: name.trim(), title: title.trim(), department, email, managerId })
  return json(employee, 201)
}
