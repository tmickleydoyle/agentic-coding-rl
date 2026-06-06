import { getItems, addItem, updateItem, deleteItem, getCompleted, getByPriority } from "../../../lib/store";
import { Priority } from "../../../lib/types";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const completed = url.searchParams.get("completed");
  const priority = url.searchParams.get("priority") as Priority | null;
  if (completed) return Response.json({ items: getCompleted() });
  if (priority) return Response.json({ items: getByPriority(priority) });
  return Response.json({ items: getItems() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!body.title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });
  const item = addItem({
    title: body.title.trim(),
    assignee: body.assignee ?? "",
    dueDate: body.dueDate ?? "",
    priority: body.priority ?? "medium",
    notes: body.notes ?? "",
    completed: body.completed ?? false,
  });
  return Response.json({ item }, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const item = updateItem(id, body);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ item });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteItem(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
