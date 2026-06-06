import { getTransactions, addTransaction, deleteTransaction } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getTransactions());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { description, amount, type, category, date } = body;
  if (!description || typeof amount !== "number" || amount <= 0 || !type || !category || !date) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const tx = addTransaction({ description, amount, type, category, date });
  return Response.json(tx, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteTransaction(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
