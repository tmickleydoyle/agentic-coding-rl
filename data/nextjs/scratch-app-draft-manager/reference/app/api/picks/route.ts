import { getPicks, makePick } from "../../../lib/store";
export function GET(_req: Request): Response { return Response.json(getPicks()); }
export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { teamId, playerId } = body;
  const pick = makePick(teamId, playerId);
  if (!pick) return Response.json({ error: "Invalid or already drafted" }, { status: 400 });
  return Response.json(pick, { status: 201 });
}
