import { getEntries, addEntry, deleteEntry, searchEntries } from "../../../lib/store";
import type { Mood } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  if (search !== null) {
    return Response.json({ entries: searchEntries(search) });
  }
  return Response.json({ entries: getEntries() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as {
    title: string;
    body: string;
    mood: Mood;
    tags: string[];
    date: string;
  };
  if (!body.title || !body.body) {
    return new Response(JSON.stringify({ error: "title and body required" }), {
      status: 400,
    });
  }
  const entry = addEntry(body);
  return Response.json({ entry }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  }
  const ok = deleteEntry(id);
  if (!ok) {
    return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  }
  return Response.json({ success: true });
}
