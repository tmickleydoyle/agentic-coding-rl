import { getTeams, addTeam, removeTeam } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getTeams());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, city, coach } = body;
  if (!name || !city || !coach) return Response.json({ error: "Missing fields" }, { status: 400 });
  return Response.json(addTeam(name, city, coach), { status: 201 });
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = parseInt(url.searchParams.get("id") ?? "");
  if (isNaN(id)) return Response.json({ error: "Invalid id" }, { status: 400 });
  const ok = removeTeam(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
