import { getEntries, addEntry, deleteEntry, getInsights } from "../../../lib/store";
import type { SleepQuality } from "../../../lib/types";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ entries: getEntries(), insights: getInsights() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { date: string; bedtime: string; wakeTime: string; quality: SleepQuality; notes: string };
  if (!body.date || !body.bedtime || !body.wakeTime) {
    return new Response(JSON.stringify({ error: "date, bedtime, and wakeTime required" }), { status: 400 });
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
