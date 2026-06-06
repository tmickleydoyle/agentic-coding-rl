export function GET(_req: Request): Response {
  return Response.json({ cards: [] });
}
export async function POST(_req: Request): Promise<Response> {
  return Response.json({ error: 'Not implemented' }, { status: 501 });
}
export function DELETE(_req: Request): Response {
  return Response.json({ ok: false });
}
