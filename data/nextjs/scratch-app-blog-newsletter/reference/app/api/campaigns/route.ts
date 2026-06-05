import {
  createCampaign,
  deleteCampaign,
  findCampaign,
  listCampaigns,
  sendCampaign,
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
  const campaigns = listCampaigns({ status: params.get('status') })
  return json({ campaigns })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const subject = body.subject
  if (typeof subject !== 'string' || subject.trim().length === 0) {
    return json({ error: 'subject required' }, 400)
  }
  const campaign = createCampaign({
    subject: subject.trim(),
    body: typeof body.body === 'string' ? body.body : undefined,
  })
  return json(campaign, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id') ?? ''
  const existing = findCampaign(id)
  if (!existing) return json({ error: 'not found' }, 404)
  if (params.get('action') !== 'send') {
    return json({ error: 'unsupported action' }, 400)
  }
  const updated = sendCampaign(id)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteCampaign(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
