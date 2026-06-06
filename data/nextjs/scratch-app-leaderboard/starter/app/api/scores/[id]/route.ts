export function GET(_req: Request, { params }: { params: { id: string } }) {
  return Response.json({ error: 'not found' }, { status: 404 });
}
