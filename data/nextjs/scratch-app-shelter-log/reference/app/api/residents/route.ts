import { getResidents, addResident } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getResidents());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as { name: string; age?: number };
  if (!body.name) return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
  const r = addResident(body.name, body.age ?? 0);
  return new Response(JSON.stringify(r), { status: 201 });
}
