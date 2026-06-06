import { getMovies, addMovie, updateMovie, removeMovie } from "../../../lib/store";

export function GET() {
  return Response.json(getMovies());
}

export async function POST(req: Request) {
  const { title, director, genre, year, runtime } = await req.json();
  const movie = addMovie({ title, director, genre, year, runtime });
  return Response.json(movie, { status: 201 });
}

export async function PATCH(req: Request) {
  const { id, ...patch } = await req.json();
  const movie = updateMovie(id, patch);
  if (!movie) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(movie);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = removeMovie(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
