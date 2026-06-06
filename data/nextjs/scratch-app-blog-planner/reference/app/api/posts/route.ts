import { getPosts, addPost, deletePost } from "../../../lib/store";
import { PostStatus } from "../../../lib/types";

export function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as PostStatus | null;
  return Response.json({ posts: getPosts(status ?? undefined) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const post = addPost(body);
  return Response.json({ post }, { status: 201 });
}

export function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const result = deletePost(id);
  if (result.error) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
