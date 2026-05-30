import {
  addFeedback,
  findHouse,
  listHouses,
  registerVisitor,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { houses } (each with counts) applying optional ?houseId= filter
  void req
  void listHouses
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: ?houseId= register a visitor from { name }; 404 if unknown, 400 if name blank
  void req
  void findHouse
  void registerVisitor
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?houseId= add feedback from { visitor, rating?, note? }; 404 if unknown, 400 if
  // visitor blank
  void req
  void findHouse
  void addFeedback
  return json({ error: 'not implemented' }, 501)
}
