import { getSupplements, addSupplement, getTodayLogs } from "../../../lib/store";
import { Supplement } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ supplements: getSupplements(), todayLogs: getTodayLogs() }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as Omit<Supplement, "id">;
  const s = addSupplement(body);
  return new Response(JSON.stringify(s), { status: 201, headers: { "Content-Type": "application/json" } });
}
