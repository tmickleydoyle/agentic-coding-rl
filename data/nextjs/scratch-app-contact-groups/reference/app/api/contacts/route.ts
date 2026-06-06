import { getGroups, addGroup, removeGroup, getContacts, addContact, removeContact, toggleFavorite, getFavorites } from "../../../lib/store";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  if (resource === "groups") return Response.json(getGroups());
  if (resource === "favorites") return Response.json(getFavorites());
  return Response.json(getContacts());
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { resource, ...data } = body;
  if (resource === "groups") return Response.json(addGroup(data), { status: 201 });
  if (resource === "toggleFavorite") {
    const result = toggleFavorite(data.id);
    if (!result) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(result);
  }
  return Response.json(addContact(data), { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const resource = url.searchParams.get("resource");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const ok = resource === "groups" ? removeGroup(id) : removeContact(id);
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ success: true });
}
