import { getHoldings, addHolding, deleteHolding, getTransactions, addTransaction } from "../../../lib/store";
import { Holding, Transaction } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  if (type === "transactions") return Response.json({ data: getTransactions() });
  return Response.json({ data: getHoldings() });
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const body = await request.json();
  if (type === "transaction") {
    addTransaction(body as Transaction);
    return Response.json({ success: true, data: body }, { status: 201 });
  }
  addHolding(body as Holding);
  return Response.json({ success: true, data: body }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  deleteHolding(id);
  return Response.json({ success: true });
}
