import { getDebts, addDebt, deleteDebt, getPayments, addPayment } from "../../../lib/store";
import { Debt, Payment } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  if (type === "payments") return Response.json({ data: getPayments() });
  return Response.json({ data: getDebts() });
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const body = await request.json();
  if (type === "payment") {
    addPayment(body as Payment);
    return Response.json({ success: true, data: body }, { status: 201 });
  }
  addDebt(body as Debt);
  return Response.json({ success: true, data: body }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  deleteDebt(id);
  return Response.json({ success: true });
}
