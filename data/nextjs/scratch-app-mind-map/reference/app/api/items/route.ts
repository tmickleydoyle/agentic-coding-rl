import { getNodes, addNode, deleteNode, getNodesByColor } from "../../../lib/store";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const color = url.searchParams.get("color");
  if (color) return Response.json({ nodes: getNodesByColor(color) });
  return Response.json({ nodes: getNodes() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!body.label?.trim()) return Response.json({ error: "Label is required" }, { status: 400 });
  const node = addNode({ label: body.label.trim(), parentId: body.parentId ?? null, color: body.color ?? "blue" });
  return Response.json({ node }, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteNode(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
