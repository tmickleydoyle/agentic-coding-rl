import { getTenants, addTenant, removeTenant, getPayments, addPayment } from "../../../lib/store";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  if (resource === "payments") {
    return Response.json(getPayments());
  }
  return Response.json(getTenants());
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  const body = await request.json();
  if (resource === "payments") {
    const payment = addPayment(body);
    return Response.json(payment, { status: 201 });
  }
  const tenant = addTenant(body);
  return Response.json(tenant, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const ok = removeTenant(id);
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ success: true });
}
