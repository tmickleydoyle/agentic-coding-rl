import { getSegmentCount } from "../../../../../../lib/store";

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const result = getSegmentCount(params.id);
  if (typeof result === "object" && "error" in result) return Response.json({ error: result.error }, { status: 404 });
  return Response.json({ count: result });
}
