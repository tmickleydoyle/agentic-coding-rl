import { getAlbums, addAlbum, updateAlbumOwnership, removeAlbum } from "../../../lib/store";

export function GET() { return Response.json(getAlbums()); }
export async function POST(req: Request) {
  const { title, artist, genre, year, tracks } = await req.json();
  const album = addAlbum({ title, artist, genre, year, tracks });
  return Response.json(album, { status: 201 });
}
export async function PATCH(req: Request) {
  const { id, ownership } = await req.json();
  const album = updateAlbumOwnership(id, ownership);
  if (!album) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(album);
}
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = removeAlbum(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
