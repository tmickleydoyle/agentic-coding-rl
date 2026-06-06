import { getGoals, addGoal, deleteGoal, updateSaved } from "../../../lib/store";
import { FinancialGoal } from "../../../lib/types";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ data: getGoals() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  addGoal(body as FinancialGoal);
  return Response.json({ success: true, data: body }, { status: 201 });
}

export async function PATCH(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const body = await request.json();
  updateSaved(id, body.savedAmount);
  return Response.json({ success: true });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  deleteGoal(id);
  return Response.json({ success: true });
}
