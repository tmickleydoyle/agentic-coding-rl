import { getPages, addPage, updatePage, deletePage, searchPages } from "../../../lib/store";

export function GET(req: Request): Response {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  if (q !== null) {
    return Response.json(searchPages(q));
  }
  return Response.json(getPages());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, content, category, author, tags } = body;
  if (!title || !category || !author) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const result = addPage({ title, content: content || "", category, author, tags: tags || [], createdAt: new Date().toISOString().slice(0, 10) });
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }
  return Response.json(result, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const updated = updatePage(id, body);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deletePage(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
