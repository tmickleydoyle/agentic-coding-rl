import { getUtilities, addUtility, removeUtility, getBills, addBill, markBillPaid, getReadings, addReading } from "../../../lib/store";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  if (resource === "bills") return Response.json(getBills());
  if (resource === "readings") return Response.json(getReadings());
  return Response.json(getUtilities());
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { resource, ...data } = body;
  if (resource === "bills") return Response.json(addBill(data), { status: 201 });
  if (resource === "readings") return Response.json(addReading(data), { status: 201 });
  if (resource === "markPaid") {
    const result = markBillPaid(data.id);
    if (!result) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(result);
  }
  return Response.json(addUtility(data), { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const ok = removeUtility(id);
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ success: true });
}
