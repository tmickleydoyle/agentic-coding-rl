import { getEntries, addEntry, getDailyGoal } from "../../../lib/store";
import { WaterEntry } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ entries: getEntries(), goal: getDailyGoal() }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as Omit<WaterEntry, "id">;
  const entry = addEntry(body);
  return new Response(JSON.stringify(entry), { status: 201, headers: { "Content-Type": "application/json" } });
}
