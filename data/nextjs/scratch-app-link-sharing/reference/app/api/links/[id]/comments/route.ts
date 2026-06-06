import { addComment } from '../../../../../lib/store';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { author, body: text } = body;
  if (!author || !text) return Response.json({ error: 'Missing required fields' }, { status: 400 });
  const comment = addComment(params.id, { author, body: text });
  if (!comment) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ comment }, { status: 201 });
}
