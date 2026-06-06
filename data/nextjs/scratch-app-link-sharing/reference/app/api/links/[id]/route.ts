import { getLink } from '../../../../lib/store';

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const link = getLink(params.id);
  if (!link) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ link });
}
