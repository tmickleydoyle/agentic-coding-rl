import { getSpeakers, addSpeaker } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify(getSpeakers()), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, expertise, bio } = body;
  if (!name || !expertise || !bio) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }
  const speaker = addSpeaker({ name, expertise: Array.isArray(expertise) ? expertise : [expertise], bio });
  return new Response(JSON.stringify(speaker), { status: 201, headers: { "Content-Type": "application/json" } });
}
