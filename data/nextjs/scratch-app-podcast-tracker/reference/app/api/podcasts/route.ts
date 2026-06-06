import { getPodcasts, addPodcast, removePodcast, markEpisode } from "../../../lib/store";

export function GET() { return Response.json(getPodcasts()); }
export async function POST(req: Request) {
  const { title, host, category, description } = await req.json();
  const podcast = addPodcast({ title, host, category, description });
  return Response.json(podcast, { status: 201 });
}
export async function PATCH(req: Request) {
  const { episodeId, played } = await req.json();
  const ep = markEpisode(episodeId, played);
  if (!ep) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(ep);
}
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = removePodcast(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
