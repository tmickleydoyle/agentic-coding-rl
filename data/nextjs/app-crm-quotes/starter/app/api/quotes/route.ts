import {
  createQuote,
  findQuote,
  isStatus,
  listQuotes,
  setQuoteStatus,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { quotes } (each with total) applying optional ?status= filter
  void req
  void listQuotes
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a draft quote from { client, items? }; 400 if client blank
  void req
  void createQuote
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set status; 404 if absent, 400 if status invalid
  void req
  void findQuote
  void isStatus
  void setQuoteStatus
  return json({ error: 'not implemented' }, 501)
}
