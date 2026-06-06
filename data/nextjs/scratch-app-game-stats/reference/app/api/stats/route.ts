import { getPlayers, updatePoints } from "../../../lib/store";
export function GET(_req: Request): Response { return Response.json(getPlayers()); }
export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { id, totalPoints } = body;
  const p = updatePoints(id, totalPoints);
  if (!p) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(p);
}
