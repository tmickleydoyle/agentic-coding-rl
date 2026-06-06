import { getFlags, addFlag } from "../../../lib/store";
import { FlagType } from "../../../lib/types";
export function GET(_req: Request): Response { return Response.json(getFlags()); }
export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { matchId, minute, type, note } = body;
  const flag = addFlag(matchId, minute, type as FlagType, note ?? "");
  if (!flag) return Response.json({ error: "Invalid" }, { status: 400 });
  return Response.json(flag, { status: 201 });
}
