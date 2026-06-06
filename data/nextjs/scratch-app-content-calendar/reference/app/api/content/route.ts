import { getItems, addItem, updateItem } from "../../../lib/store";
import { ContentStatus } from "../../../lib/types";

export function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as ContentStatus | null;
  return Response.json({ items: getItems(status ?? undefined) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = addItem(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ item: result }, { status: 201 });
}

export async function PATCH(req: Request) {
  const { id, ...data } = await req.json();
  const item = updateItem(id, data);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ item });
}
