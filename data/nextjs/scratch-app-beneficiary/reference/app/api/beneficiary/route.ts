import { getReport } from "../../../lib/store";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { action: string };
  if (body.action === "report") {
    return Response.json(getReport());
  }
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
