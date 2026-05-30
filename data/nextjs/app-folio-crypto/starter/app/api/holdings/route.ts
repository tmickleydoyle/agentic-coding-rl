import { createCoin, deleteCoin, findCoin, listCoins } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { coins: listCoins() }
  void req
  void listCoins
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a coin from { symbol, amount, price, name?, change24h? }; 400 on invalid
  void req
  void createCoin
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void findCoin
  void deleteCoin
  return json({ error: 'not implemented' }, 501)
}
