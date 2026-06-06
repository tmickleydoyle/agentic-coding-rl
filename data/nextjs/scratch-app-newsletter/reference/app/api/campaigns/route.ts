import { getCampaigns, addCampaign, deleteCampaign } from "../../../lib/store";

export function GET() { return Response.json({ campaigns: getCampaigns() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const result = addCampaign(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ campaign: result }, { status: 201 });
}

export function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const result = deleteCampaign(id);
  if (result.error) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
