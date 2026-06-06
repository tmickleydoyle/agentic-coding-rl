import { getRoster, addToRoster } from "../../../lib/store";
export function GET(_req: Request): Response { return Response.json(getRoster()); }
export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { playerId } = body;
  const p = addToRoster(playerId);
  if (!p) return Response.json({ error: "Cannot add" }, { status: 400 });
  return Response.json(p, { status: 201 });
}
