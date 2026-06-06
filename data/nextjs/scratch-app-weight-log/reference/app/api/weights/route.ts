import { getEntries, addEntry, deleteEntry, getStats } from "../../../lib/store";
import type { WeightUnit } from "../../../lib/types";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ entries: getEntries(), stats: getStats() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { date: string; weight: number; unit: WeightUnit; note: string };
  if (!body.weight || body.weight <= 0) {
    return new Response(JSON.stringify({ error: "valid weight required" }), { status: 400 });
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
