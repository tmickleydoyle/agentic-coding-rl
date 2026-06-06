import { getTrips, addTrip } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getTrips());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const trip = addTrip(body);
  return Response.json(trip, { status: 201 });
}
