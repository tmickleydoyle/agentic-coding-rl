import { getKeywords, addKeyword, deleteKeyword } from "../../../lib/store";

export function GET() { return Response.json({ keywords: getKeywords() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const result = addKeyword(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ keyword: result }, { status: 201 });
}

export function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const ok = deleteKeyword(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
