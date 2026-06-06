import { publishItem } from "../../../../lib/store";

export async function POST(req: Request) {
  const { id } = await req.json();
  const result = publishItem(id);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ item: result });
}
