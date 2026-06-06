import { getProposal } from '../../../../lib/store';

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const proposal = getProposal(params.id);
  if (!proposal) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ proposal });
}
