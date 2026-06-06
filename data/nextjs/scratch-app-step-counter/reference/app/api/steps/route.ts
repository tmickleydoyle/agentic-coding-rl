import { getEntries, addEntry, deleteEntry, getGoal, updateGoal, getStats } from "../../../lib/store";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ entries: getEntries(), goal: getGoal(), stats: getStats() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { date: string; steps: number; notes: string };
  if (!body.date || !body.steps || body.steps <= 0) {
    return new Response(JSON.stringify({ error: "date and positive steps required" }), { status: 400 });
  }
  const entry = addEntry(body);
  return Response.json({ entry }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  const ok = deleteEntry(id);
  if (!ok) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return Response.json({ success: true });
}

export async function PUT(request: Request): Promise<Response> {
  const body = await request.json() as { dailyTarget: number };
  if (!body.dailyTarget || body.dailyTarget <= 0) {
    return new Response(JSON.stringify({ error: "valid dailyTarget required" }), { status: 400 });
  }
  const goal = updateGoal(body.dailyTarget);
  return Response.json({ goal });
}
