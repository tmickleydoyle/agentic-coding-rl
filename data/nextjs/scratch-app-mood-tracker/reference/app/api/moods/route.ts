import { getLogs, addLog, deleteLog, getAverageMood, getMoodDistribution } from "../../../lib/store";
import type { MoodLevel } from "../../../lib/types";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ logs: getLogs(), average: getAverageMood(), distribution: getMoodDistribution() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { date: string; level: MoodLevel; note: string; activities: string[] };
  if (!body.note) {
    return new Response(JSON.stringify({ error: "note required" }), { status: 400 });
  }
  if (body.level < 1 || body.level > 5) {
    return new Response(JSON.stringify({ error: "level must be 1-5" }), { status: 400 });
  }
  const log = addLog(body);
  return Response.json({ log }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  const ok = deleteLog(id);
  if (!ok) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return Response.json({ success: true });
}
