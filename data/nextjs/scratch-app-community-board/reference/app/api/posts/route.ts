import { getPosts, addPost } from "../../../lib/store";
import type { PostCategory } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getPosts());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as { title: string; author: string; category: PostCategory; content: string };
  if (!body.title) {
    return new Response(JSON.stringify({ error: "title required" }), { status: 400 });
  }
  const p = addPost(body.title, body.author ?? "", body.category ?? "News", body.content ?? "");
  return new Response(JSON.stringify(p), { status: 201 });
}
