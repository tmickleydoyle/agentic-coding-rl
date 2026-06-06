export function GET(_req: Request, { params }: { params: { id: string } }) {
  return Response.json({ error: 'not found' }, { status: 404 });
}
export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  return Response.json({ error: 'not found' }, { status: 404 });
}
