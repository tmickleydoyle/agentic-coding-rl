import { getBills, addBill, deleteBill, toggleBill } from "../../../lib/store";
import { Bill } from "../../../lib/types";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ data: getBills() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  addBill(body as Bill);
  return Response.json({ success: true, data: body }, { status: 201 });
}

export async function PATCH(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  toggleBill(id);
  return Response.json({ success: true });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  deleteBill(id);
  return Response.json({ success: true });
}
