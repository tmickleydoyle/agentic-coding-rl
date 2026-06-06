import { getCopies, addCopy } from "../../../lib/store";
import { CopyStatus } from "../../../lib/types";

export function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as CopyStatus | null;
  return Response.json({ copies: getCopies(status ?? undefined) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = addCopy(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ copy: result }, { status: 201 });
}
