import { getItems, addItem, updateItem, removeItem } from "../../../lib/store";

export function GET() { return Response.json(getItems()); }
export async function POST(req: Request) {
  const { name, price, url, category, priority } = await req.json();
  const item = addItem({ name, price, url, category, priority });
  return Response.json(item, { status: 201 });
}
export async function PATCH(req: Request) {
  const { id, ...patch } = await req.json();
  const item = updateItem(id, patch);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(item);
}
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = removeItem(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
