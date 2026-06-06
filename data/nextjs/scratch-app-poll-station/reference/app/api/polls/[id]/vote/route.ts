import { vote } from '../../../../../lib/store';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { optionId } = body;
  if (!optionId) return Response.json({ error: 'Missing optionId' }, { status: 400 });
  const result = vote(params.id, optionId);
  if (result.error) return Response.json({ error: result.error }, { status: result.status ?? 400 });
  return Response.json({ poll: result.poll });
}
