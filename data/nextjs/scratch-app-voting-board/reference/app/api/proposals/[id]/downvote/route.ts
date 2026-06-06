import { downvote } from '../../../../../lib/store';

export function POST(_req: Request, { params }: { params: { id: string } }) {
  const result = downvote(params.id);
  if (result.error) return Response.json({ error: result.error }, { status: result.status ?? 400 });
  return Response.json({ downvotes: result.downvotes, score: result.score });
}
