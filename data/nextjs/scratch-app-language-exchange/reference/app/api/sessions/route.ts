import { getSessions, addSession, deleteSession } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getSessions());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { partnerId, partnerName, language, date, durationMinutes, notes } = body;
  if (!partnerId || !partnerName || !language || !date || !durationMinutes) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  const mins = Number(durationMinutes);
  if (isNaN(mins) || mins <= 0) {
    return Response.json({ error: "Invalid duration" }, { status: 400 });
  }
  const session = addSession({ partnerId, partnerName, language, date, durationMinutes: mins, notes: notes || "" });
  return Response.json(session, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const deleted = deleteSession(id);
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
