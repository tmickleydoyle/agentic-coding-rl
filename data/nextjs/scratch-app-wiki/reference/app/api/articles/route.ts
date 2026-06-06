import { getArticles, createArticle } from '../../../lib/store';

export function GET() {
  return Response.json(getArticles());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, body: text, author, tags } = body;
  if (!title || !text || !author) return Response.json({ error: 'Missing required fields' }, { status: 400 });
  const article = createArticle({ title, body: text, author, tags: tags ?? [] });
  return Response.json({ article }, { status: 201 });
}
