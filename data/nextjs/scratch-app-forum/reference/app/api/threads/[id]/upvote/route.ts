import { upvoteThread } from '../../../../../lib/store';

export function POST(_req: Request, { params }: { params: { id: string } }) {
  const upvotes = upvoteThread(params.id);
  if (upvotes === null) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ upvotes });
}
