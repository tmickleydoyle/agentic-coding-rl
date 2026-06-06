import { getFolders, addFolder, removeFolder, getDocuments, addDocument, removeDocument, toggleShared, searchDocuments } from "../../../lib/store";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  if (resource === "folders") return Response.json(getFolders());
  if (resource === "search") {
    const q = url.searchParams.get("q") ?? "";
    return Response.json(searchDocuments(q));
  }
  return Response.json(getDocuments());
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { resource, ...data } = body;
  if (resource === "folders") return Response.json(addFolder(data), { status: 201 });
  if (resource === "toggleShared") {
    const result = toggleShared(data.id);
    if (!result) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(result);
  }
  return Response.json(addDocument(data), { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const resource = url.searchParams.get("resource");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const ok = resource === "folders" ? removeFolder(id) : removeDocument(id);
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ success: true });
}
