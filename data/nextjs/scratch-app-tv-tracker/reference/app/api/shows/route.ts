import { getShows, addShow, updateShow, removeShow } from "../../../lib/store";

export function GET() { return Response.json(getShows()); }
export async function POST(req: Request) {
  const { title, network, genre, totalSeasons } = await req.json();
  const show = addShow({ title, network, genre, totalSeasons });
  return Response.json(show, { status: 201 });
}
export async function PATCH(req: Request) {
  const { id, ...patch } = await req.json();
  const show = updateShow(id, patch);
  if (!show) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(show);
}
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = removeShow(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
