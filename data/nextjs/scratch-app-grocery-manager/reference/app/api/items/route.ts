import { getItems, addItem } from "../../../lib/store";
import { GroceryItem } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ items: getItems() }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as Omit<GroceryItem, "id" | "checked">;
  const item = addItem(body);
  return new Response(JSON.stringify(item), { status: 201, headers: { "Content-Type": "application/json" } });
}
