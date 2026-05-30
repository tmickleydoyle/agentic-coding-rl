import {
  createStation,
  deleteStation,
  findStation,
  listStations,
  updateStation,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { stations } applying ?genre=, ?favorite=, ?minBitrate= filters
  void req
  void listStations
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a station from { name, genre?, bitrate? }; 400 if name blank
  void req
  void createStation
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch (play:true increments playCount); 404 if absent
  void req
  void findStation
  void updateStation
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteStation
  return json({ error: 'not implemented' }, 501)
}
