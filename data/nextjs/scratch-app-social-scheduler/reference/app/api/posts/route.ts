import { getPosts, addPost } from "../../../lib/store";
import { PostStatus } from "../../../lib/types";

export function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as PostStatus | null;
  return Response.json({ posts: getPosts(status ?? undefined) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = addPost(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ post: result }, { status: 201 });
}
