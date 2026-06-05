import {
  createApplication,
  findApplication,
  findUnit,
  isStatus,
  listApplications,
  setApplicationStatus,
} from '../../../lib/store'

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
  const applications = listApplications({
    unitId: params.get('unitId'),
    status: params.get('status'),
  })
  return json({ applications })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const applicant = body.applicant
  if (typeof applicant !== 'string' || applicant.trim().length === 0) {
    return json({ error: 'applicant required' }, 400)
  }
  const unitId = typeof body.unitId === 'string' ? body.unitId : ''
  if (!findUnit(unitId)) return json({ error: 'unit not found' }, 404)
  const app = createApplication({ unitId, applicant: applicant.trim() })
  return json(app, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  if (!findApplication(id)) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (!isStatus(body.status)) return json({ error: 'invalid status' }, 400)
  const updated = setApplicationStatus(id, body.status)
  return json(updated)
}
