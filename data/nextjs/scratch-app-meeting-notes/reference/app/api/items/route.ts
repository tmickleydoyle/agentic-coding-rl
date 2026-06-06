import { getMeetings, addMeeting, updateMeeting, deleteMeeting, searchMeetings } from "../../../lib/store";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  if (q) return Response.json({ meetings: searchMeetings(q) });
  return Response.json({ meetings: getMeetings() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!body.title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });
  const m = addMeeting({
    title: body.title.trim(),
    date: body.date ?? "",
    attendees: body.attendees ?? "",
    agenda: body.agenda ?? [],
    notes: body.notes ?? "",
    actionItems: body.actionItems ?? "",
  });
  return Response.json({ meeting: m }, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const m = updateMeeting(id, body);
  if (!m) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ meeting: m });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteMeeting(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
