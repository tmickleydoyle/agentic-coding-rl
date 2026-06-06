import { getDecisions, addDecision, updateDecision, deleteDecision, getByStatus, getStats } from "../../../lib/store";
import { DecisionStatus } from "../../../lib/types";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as DecisionStatus | null;
  const statsFlag = url.searchParams.get("stats");
  if (statsFlag) return Response.json({ stats: getStats() });
  if (status) return Response.json({ decisions: getByStatus(status) });
  return Response.json({ decisions: getDecisions() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!body.title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });
  const d = addDecision({
    title: body.title.trim(),
    context: body.context ?? "",
    options: body.options ?? "",
    outcome: body.outcome ?? "",
    status: body.status ?? "pending",
    tags: Array.isArray(body.tags) ? body.tags : [],
    decisionDate: body.decisionDate ?? "",
  });
  return Response.json({ decision: d }, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const d = updateDecision(id, body);
  if (!d) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ decision: d });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteDecision(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
