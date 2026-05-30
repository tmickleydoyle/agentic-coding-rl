import {
  createDeal,
  deleteDeal,
  findDeal,
  isStage,
  listDeals,
  stageRollup,
  updateDeal,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { deals } with ?stage=/?contactId= filters; ?rollup=true -> { rollup }
  void req
  void listDeals
  void stageRollup
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a deal from { title, value?, stage?, contactId? }; 400 if title blank
  void req
  void createDeal
  void isStage
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch stage/value/title; 404 if absent
  void req
  void findDeal
  void updateDeal
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteDeal
  return json({ error: 'not implemented' }, 501)
}
