import {
  createActivity,
  createTrip,
  deleteActivity,
  findTrip,
  listActivities,
  listTrips,
  tripCost,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: no params => { trips } with cost; ?tripId= => { trip, activities, cost } or 404
  void req
  void listTrips
  void findTrip
  void listActivities
  void tripCost
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: body.tripId => create activity (404/400); else create trip (400 name required)
  void req
  void createTrip
  void createActivity
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?activityId= delete; 404 if absent
  void req
  void deleteActivity
  return json({ error: 'not implemented' }, 501)
}
