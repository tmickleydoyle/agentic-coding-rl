import { getArguments, addArgument, deleteArgument, getByType } from "../../../lib/store";
import { ArgumentType } from "../../../lib/types";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") as ArgumentType | null;
  if (type) return Response.json({ arguments: getByType(type) });
  return Response.json({ arguments: getArguments() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!body.text?.trim()) return Response.json({ error: "Text is required" }, { status: 400 });
  const a = addArgument({
    text: body.text.trim(),
    type: body.type ?? "claim",
    parentId: body.parentId ?? null,
    topic: body.topic ?? "",
  });
  return Response.json({ argument: a }, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteArgument(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
