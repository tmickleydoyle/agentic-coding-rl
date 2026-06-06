import { getAthletes, addAthlete, removeAthlete } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getAthletes());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, sport, position } = body;
  if (!name || !sport || !position) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }
  const athlete = addAthlete(name, sport, position);
  return Response.json(athlete, { status: 201 });
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = parseInt(url.searchParams.get("id") ?? "");
  if (isNaN(id)) return Response.json({ error: "Invalid id" }, { status: 400 });
  const ok = removeAthlete(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
