import { getCompetitions, addCompetition } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getCompetitions());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, sport, date, location } = body;
  const comp = addCompetition(name, sport, date, location);
  if (!comp) {
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }
  return Response.json(comp, { status: 201 });
}
