import { getFunnelStats } from "../../../../../../lib/store";

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const result = getFunnelStats(params.id);
  if ("error" in result) return Response.json({ error: result.error }, { status: 404 });
  return Response.json({ stats: result });
}
