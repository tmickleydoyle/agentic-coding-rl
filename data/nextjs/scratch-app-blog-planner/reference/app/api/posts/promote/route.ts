import { promoteIdea } from "../../../../lib/store";

export async function POST(req: Request) {
  const { id } = await req.json();
  const result = promoteIdea(id);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ post: result });
}
