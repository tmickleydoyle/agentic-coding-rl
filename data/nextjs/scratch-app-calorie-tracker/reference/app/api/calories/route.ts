import { getLogs, addLog, getGoals } from "../../../lib/store";
import { FoodLog } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ logs: getLogs(), goals: getGoals() }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as Omit<FoodLog, "id">;
  const log = addLog(body);
  return new Response(JSON.stringify(log), { status: 201, headers: { "Content-Type": "application/json" } });
}
