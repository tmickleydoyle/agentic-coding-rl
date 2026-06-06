import { getScore } from '../../../../lib/store';

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const score = getScore(params.id);
  if (!score) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ score });
}
