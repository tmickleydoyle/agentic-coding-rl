import { closePoll } from '../../../../../lib/store';

export function POST(_req: Request, { params }: { params: { id: string } }) {
  const poll = closePoll(params.id);
  if (!poll) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ poll });
}
