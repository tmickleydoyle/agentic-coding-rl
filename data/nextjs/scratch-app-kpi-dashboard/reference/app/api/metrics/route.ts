import { getMetrics, addMetric, deleteMetric } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getMetrics());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, category, unit, currentValue, targetValue } = body;
  if (!name || !category || !unit || typeof currentValue !== "number" || typeof targetValue !== "number") {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const metric = addMetric({ name, category, unit, currentValue, targetValue });
  return Response.json(metric, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteMetric(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
