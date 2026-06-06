import { getRoommates, addRoommate, removeRoommate, getExpenses, addExpense, getSettlements, addSettlement } from "../../../lib/store";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  if (resource === "expenses") return Response.json(getExpenses());
  if (resource === "settlements") return Response.json(getSettlements());
  return Response.json(getRoommates());
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { resource, ...data } = body;
  if (resource === "expenses") {
    const e = addExpense(data);
    return Response.json(e, { status: 201 });
  }
  if (resource === "settlements") {
    const s = addSettlement(data);
    return Response.json(s, { status: 201 });
  }
  const r = addRoommate(data);
  return Response.json(r, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const ok = removeRoommate(id);
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ success: true });
}
