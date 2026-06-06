import { getMatches, recordResult } from "../../../lib/store";
export function GET(_req: Request): Response { return Response.json(getMatches()); }
export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { matchId, winnerId } = body;
  const result = recordResult(matchId, winnerId);
  if (!result) return Response.json({ error: "Invalid" }, { status: 400 });
  return Response.json(result);
}
