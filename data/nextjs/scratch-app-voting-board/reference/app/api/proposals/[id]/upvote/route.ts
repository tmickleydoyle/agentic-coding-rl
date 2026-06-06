import { upvote } from '../../../../../lib/store';

export function POST(_req: Request, { params }: { params: { id: string } }) {
  const result = upvote(params.id);
  if (result.error) return Response.json({ error: result.error }, { status: result.status ?? 400 });
  return Response.json({ upvotes: result.upvotes, score: result.score });
}
