import { createTicker, deleteTicker, findTicker, listTickers } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { tickers } applying ?alerts=true filter
  void req
  void listTickers
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a ticker from { symbol, price, targetPrice, name?, direction? }; 400 on invalid
  void req
  void createTicker
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void findTicker
  void deleteTicker
  return json({ error: 'not implemented' }, 501)
}
