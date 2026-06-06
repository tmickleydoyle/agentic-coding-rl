import { getEntries, addEntry, deleteEntry } from "../../../lib/store";

export function GET() {
  return Response.json({ entries: getEntries() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = addEntry(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ entry: result }, { status: 201 });
}

export function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const ok = deleteEntry(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
