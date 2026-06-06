import { getEntries, addEntry } from "../../../lib/store";
import { DietEntry } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ entries: getEntries() }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as Omit<DietEntry, "id">;
  const entry = addEntry(body);
  return new Response(JSON.stringify(entry), { status: 201, headers: { "Content-Type": "application/json" } });
}
