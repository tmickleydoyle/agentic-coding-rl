import { getSummary } from "../../../lib/store";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { action: string };
  if (body.action === "summary") {
    return Response.json(getSummary());
  }
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
