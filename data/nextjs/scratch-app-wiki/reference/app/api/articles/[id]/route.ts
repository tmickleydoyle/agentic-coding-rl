import { getArticle, editArticle } from '../../../../lib/store';

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const article = getArticle(params.id);
  if (!article) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ article });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { body: text, editedBy } = body;
  if (!text || !editedBy) return Response.json({ error: 'Missing required fields' }, { status: 400 });
  const article = editArticle(params.id, { body: text, editedBy });
  if (!article) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ article });
}
