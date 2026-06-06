import { getSubscribers, addSubscriber, deactivateSubscriber } from "../../../lib/store";

export function GET() { return Response.json({ subscribers: getSubscribers() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const result = addSubscriber(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ subscriber: result }, { status: 201 });
}

export function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const ok = deactivateSubscriber(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
