import { getBriefs, addBrief } from "../../../../lib/store";

export function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") ?? undefined;
  return Response.json({ briefs: getBriefs(projectId) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = addBrief(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ brief: result }, { status: 201 });
}
