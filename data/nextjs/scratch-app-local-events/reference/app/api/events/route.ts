import { getEvents, createEvent } from "../../../lib/store";
import type { EventCategory } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getEvents());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as { title: string; date: string; category: EventCategory; organizer: string; capacity: number };
  if (!body.title) {
    return new Response(JSON.stringify({ error: "title required" }), { status: 400 });
  }
  const ev = createEvent(body.title, body.date ?? "", body.category ?? "Community", body.organizer ?? "", body.capacity ?? 0);
  return new Response(JSON.stringify(ev), { status: 201 });
}
