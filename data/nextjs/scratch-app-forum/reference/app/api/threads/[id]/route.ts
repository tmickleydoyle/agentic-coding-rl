import { getThread } from '../../../../lib/store';

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const thread = getThread(params.id);
  if (!thread) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ thread });
}
