import { getConferences, addConference } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify(getConferences()), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, date, location } = body;
  if (!name || !date || !location) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }
  const conf = addConference({ name, date, location });
  return new Response(JSON.stringify(conf), { status: 201, headers: { "Content-Type": "application/json" } });
}
