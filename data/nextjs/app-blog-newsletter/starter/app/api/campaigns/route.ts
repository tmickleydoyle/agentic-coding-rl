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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { campaigns } applying ?status= filter
  void req
  void listCampaigns
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a draft campaign from { subject, body? }; 400 if subject blank
  void req
  void createCampaign
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id=&action=send marks sent; 400 if not action=send; 404 if absent
  void req
  void findCampaign
  void sendCampaign
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteCampaign
  return json({ error: 'not implemented' }, 501)
}
