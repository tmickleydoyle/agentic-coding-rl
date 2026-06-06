import { getBacklinks, addBacklink } from "../../../../lib/store";
import { BacklinkStatus } from "../../../../lib/types";

export function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as BacklinkStatus | null;
  return Response.json({ backlinks: getBacklinks(status ?? undefined) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = addBacklink(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ backlink: result }, { status: 201 });
}
