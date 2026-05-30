import { createHolding, deleteHolding, findHolding, listHoldings } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { holdings: listHoldings() }
  void req
  void listHoldings
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a holding from { symbol, shares, costBasis, name?, price? }; 400 on invalid
  void req
  void createHolding
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void findHolding
  void deleteHolding
  return json({ error: 'not implemented' }, 501)
}
