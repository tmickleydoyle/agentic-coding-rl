import { getRoom } from '../../../../lib/store';

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const room = getRoom(params.id);
  if (!room) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ room });
}
