import { getGoals, addGoal, updateGoal, removeGoal } from "../../../lib/store";

export function GET() { return Response.json(getGoals()); }
export async function POST(req: Request) {
  const { title, description, category, targetDate, difficulty } = await req.json();
  const goal = addGoal({ title, description, category, targetDate, difficulty });
  return Response.json(goal, { status: 201 });
}
export async function PATCH(req: Request) {
  const { id, ...patch } = await req.json();
  const goal = updateGoal(id, patch);
  if (!goal) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(goal);
}
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = removeGoal(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
