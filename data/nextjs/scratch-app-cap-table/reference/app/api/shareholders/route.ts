import { getShareholders, addShareholder, deleteShareholder } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getShareholders());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, type, shares } = body;
  if (!name || !type || typeof shares !== "number" || shares <= 0) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const shareholder = addShareholder({ name, type, shares });
  return Response.json(shareholder, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteShareholder(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
