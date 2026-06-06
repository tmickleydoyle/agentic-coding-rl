import { getCitations, addCitation, updateCitation, deleteCitation, searchCitations, exportApa } from "../../../lib/store";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const exp = url.searchParams.get("export");
  if (q) {
    return Response.json({ citations: searchCitations(q) });
  }
  if (exp === "apa") {
    const idsParam = url.searchParams.get("ids");
    const ids = idsParam ? idsParam.split(",").filter(Boolean) : undefined;
    return Response.json({ apa: exportApa(ids) });
  }
  return Response.json({ citations: getCitations() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!body.title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });
  const c = addCitation({
    title: body.title.trim(),
    authors: body.authors ?? "",
    year: body.year ?? "",
    type: body.type ?? "other",
    url: body.url ?? "",
    collection: body.collection ?? "",
    notes: body.notes ?? "",
  });
  return Response.json({ citation: c }, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const c = updateCitation(id, body);
  if (!c) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ citation: c });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteCitation(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
