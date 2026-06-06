import { getRequests, addRequest } from "../../../lib/store";
import type { AidCategory } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getRequests());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as { title: string; category: AidCategory; requester: string };
  if (!body.title) return new Response(JSON.stringify({ error: "title required" }), { status: 400 });
  const r = addRequest(body.title, body.category ?? "Other", body.requester ?? "");
  return new Response(JSON.stringify(r), { status: 201 });
}
