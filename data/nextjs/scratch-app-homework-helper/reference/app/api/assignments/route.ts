import { getAssignments, addAssignment, deleteAssignment } from "../../../lib/store";
import type { Priority } from "../../../lib/types";

export function GET(): Response {
  return Response.json(getAssignments());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, subject, dueDate, priority, description, estimatedMinutes } = body;
  if (!title || !subject || !dueDate) {
    return Response.json({ error: "title, subject, dueDate required" }, { status: 400 });
  }
  const mins = Number(estimatedMinutes ?? 30);
  if (isNaN(mins) || mins < 0) {
    return Response.json({ error: "estimatedMinutes must be non-negative" }, { status: 400 });
  }
  const a = addAssignment({ title, subject, dueDate, priority: (priority as Priority) || "medium", status: "todo", description: description || "", estimatedMinutes: mins });
  return Response.json(a, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const deleted = deleteAssignment(id);
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
