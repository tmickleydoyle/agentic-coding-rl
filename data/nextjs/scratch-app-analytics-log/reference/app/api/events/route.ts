import { getEvents, addEvent } from "../../../lib/store";

export function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name") ?? undefined;
  return Response.json({ events: getEvents(name) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = addEvent(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ event: result }, { status: 201 });
}
