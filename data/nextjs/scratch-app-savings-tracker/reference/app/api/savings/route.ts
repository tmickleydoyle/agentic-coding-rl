import { getGoals, addGoal, deleteGoal, getContributions, addContribution } from "../../../lib/store";
import { Goal, Contribution } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  if (type === "contributions") return Response.json({ data: getContributions() });
  return Response.json({ data: getGoals() });
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const body = await request.json();
  if (type === "contribution") {
    addContribution(body as Contribution);
    return Response.json({ success: true, data: body }, { status: 201 });
  }
  addGoal(body as Goal);
  return Response.json({ success: true, data: body }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  deleteGoal(id);
  return Response.json({ success: true });
}
