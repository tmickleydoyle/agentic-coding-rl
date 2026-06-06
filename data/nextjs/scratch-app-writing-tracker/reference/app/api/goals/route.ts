import { getGoals, addGoal, updateGoal } from "../../../lib/store";

export function GET() {
  return Response.json({ goals: getGoals() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const goal = addGoal(body);
  return Response.json({ goal }, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  const goal = updateGoal(id, data);
  if (!goal) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ goal });
}
