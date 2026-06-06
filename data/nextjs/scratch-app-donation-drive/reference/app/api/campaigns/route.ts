import { getCampaigns, addCampaign } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getCampaigns());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as { name: string; goal: number; endDate: string };
  if (!body.name) return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
  const c = addCampaign(body.name, body.goal ?? 0, body.endDate ?? "");
  return new Response(JSON.stringify(c), { status: 201 });
}
