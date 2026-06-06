import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getExpenses());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, category, amount } = body;
  if (!name || !category || typeof amount !== "number" || amount <= 0) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const expense = addExpense({ name, category, amount });
  return Response.json(expense, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const updated = updateExpense(id, body);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteExpense(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
