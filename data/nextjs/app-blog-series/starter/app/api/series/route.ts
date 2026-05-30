import {
  createPart,
  findPart,
  findSeries,
  listParts,
  listSeries,
  updatePart,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { series, parts } applying optional ?seriesId= filter
  void req
  void listSeries
  void listParts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a part from { seriesId, title }; 400 if title blank, 404 if series unknown
  void req
  void createPart
  void findSeries
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= toggle/set read; 404 if absent
  void req
  void findPart
  void updatePart
  return json({ error: 'not implemented' }, 501)
}
