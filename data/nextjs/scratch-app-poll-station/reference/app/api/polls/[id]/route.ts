import { getPoll } from '../../../../lib/store';

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const poll = getPoll(params.id);
  if (!poll) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ poll });
}
