import { getObjectives, addObjective, updateObjective, deleteObjective, getByStatus, addKeyResult, updateKeyResult, getProgressSummary } from "../../../lib/store";
import { OkrStatus } from "../../../lib/types";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as OkrStatus | null;
  const summary = url.searchParams.get("summary");
  if (summary) return Response.json({ summary: getProgressSummary() });
  if (status) return Response.json({ objectives: getByStatus(status) });
  return Response.json({ objectives: getObjectives() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!body.title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });
  const o = addObjective({
    title: body.title.trim(),
    description: body.description ?? "",
    quarter: body.quarter ?? "",
    status: body.status ?? "on_track",
    keyResults: body.keyResults ?? [],
  });
  return Response.json({ objective: o }, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const action = url.searchParams.get("action");
  const body = await req.json();

  if (action === "addkr") {
    const o = addKeyResult(id, body);
    if (!o) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ objective: o });
  }

  if (action === "updatekr") {
    const krId = url.searchParams.get("krId");
    if (!krId) return Response.json({ error: "Missing krId" }, { status: 400 });
    const o = updateKeyResult(id, krId, body);
    if (!o) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ objective: o });
  }

  const o = updateObjective(id, body);
  if (!o) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ objective: o });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteObjective(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
