import { getDocuments, addDocument } from "../../../lib/store";
import type { Category, Status } from "../../../lib/types";

export function GET(_req: Request): Response {
  return Response.json(getDocuments());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, category, status } = body as { title: string; category: Category; status: Status };
  if (!title || !title.trim()) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }
  const doc = addDocument({ title: title.trim(), category, status });
  return Response.json(doc, { status: 201 });
}
