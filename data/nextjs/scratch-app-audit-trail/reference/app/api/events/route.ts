import { getEvents, appendEvent } from "../../../lib/store";
import type { AuditAction } from "../../../lib/types";

export function GET(_req: Request): Response {
  return Response.json(getEvents());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { actor, action, resource, details } = body as {
    actor: string; action: AuditAction; resource: string; details: string;
  };
  if (!actor?.trim()) return Response.json({ error: "Actor is required" }, { status: 400 });
  if (!action?.trim()) return Response.json({ error: "Action is required" }, { status: 400 });
  const ev = appendEvent({ actor, action, resource: resource ?? "", details: details ?? "" });
  return Response.json(ev, { status: 201 });
}
