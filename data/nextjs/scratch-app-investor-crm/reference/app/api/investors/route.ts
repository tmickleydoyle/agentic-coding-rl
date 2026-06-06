import { getInvestors, addInvestor, updateInvestor, deleteInvestor } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getInvestors());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, firm, email, stage } = body;
  if (!name || !firm || !email || !email.includes("@") || !stage) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const investor = addInvestor({ name, firm, email, stage });
  return Response.json(investor, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const updated = updateInvestor(id, body);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteInvestor(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
