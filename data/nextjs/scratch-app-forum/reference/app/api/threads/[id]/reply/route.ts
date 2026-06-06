import { addReply } from '../../../../../lib/store';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { author, body: text } = body;
  if (!author || !text) return Response.json({ error: 'Missing required fields' }, { status: 400 });
  const reply = addReply(params.id, { author, body: text });
  if (!reply) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ reply }, { status: 201 });
}
