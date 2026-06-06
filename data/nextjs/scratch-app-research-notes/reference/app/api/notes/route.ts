import { getNotes, addNote, updateNote, deleteNote, searchNotes } from "../../../lib/store";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  if (q) {
    return Response.json({ notes: searchNotes(q) });
  }
  return Response.json({ notes: getNotes() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!body.title?.trim()) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }
  const note = addNote({
    title: body.title.trim(),
    content: body.content ?? "",
    tags: Array.isArray(body.tags) ? body.tags : [],
    sourceUrl: body.sourceUrl ?? "",
  });
  return Response.json({ note }, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const note = updateNote(id, body);
  if (!note) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ note });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteNote(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
