import { getLogs, addLog } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getLogs());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { exerciseId, date, sets, reps, weightKg } = body;
  const entry = addLog(exerciseId, date, sets, reps, weightKg);
  if (!entry) return Response.json({ error: "Invalid input" }, { status: 400 });
  return Response.json(entry, { status: 201 });
}
