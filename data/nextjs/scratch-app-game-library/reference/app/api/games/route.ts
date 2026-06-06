import { getGames, addGame, updateGame, removeGame } from "../../../lib/store";

export function GET() { return Response.json(getGames()); }
export async function POST(req: Request) {
  const { title, developer, genre, platform, estimatedHours } = await req.json();
  const game = addGame({ title, developer, genre, platform, estimatedHours });
  return Response.json(game, { status: 201 });
}
export async function PATCH(req: Request) {
  const { id, ...patch } = await req.json();
  const game = updateGame(id, patch);
  if (!game) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(game);
}
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = removeGame(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
