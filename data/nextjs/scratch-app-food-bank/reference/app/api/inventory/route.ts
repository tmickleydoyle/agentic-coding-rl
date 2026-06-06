import { getItems, addItem } from "../../../lib/store";
import type { FoodCategory } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getItems());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as { name: string; category: FoodCategory; quantity: number; unit: string; expiry: string };
  if (!body.name) return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
  const item = addItem(body.name, body.category ?? "Dry", body.quantity ?? 0, body.unit ?? "", body.expiry ?? "");
  return new Response(JSON.stringify(item), { status: 201 });
}
