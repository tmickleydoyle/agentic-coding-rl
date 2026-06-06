import { getGroups, addGroup, deleteGroup } from "../../../lib/store";
import type { Subject, MeetingFormat } from "../../../lib/types";

export function GET(): Response {
  return Response.json(getGroups());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, subject, description, maxMembers, meetingFormat } = body;
  if (!name || !subject || !maxMembers || !meetingFormat) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  const max = Number(maxMembers);
  if (isNaN(max) || max < 2) {
    return Response.json({ error: "maxMembers must be at least 2" }, { status: 400 });
  }
  const group = addGroup({ name, subject: subject as Subject, description: description || "", maxMembers: max, memberIds: [], meetingFormat: meetingFormat as MeetingFormat });
  return Response.json(group, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const deleted = deleteGroup(id);
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
