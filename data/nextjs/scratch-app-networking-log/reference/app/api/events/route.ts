import { getEvents, addEvent } from "../../../lib/store";
import { NetworkEvent } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify(getEvents()), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, date, location, type } = body;
  if (!name || !date || !location || !type) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }
  const event = addEvent({ name, date, location, type: type as NetworkEvent["type"] });
  return new Response(JSON.stringify(event), { status: 201, headers: { "Content-Type": "application/json" } });
}
