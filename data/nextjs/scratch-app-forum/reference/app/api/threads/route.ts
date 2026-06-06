import { getThreads, createThread } from '../../../lib/store';

export function GET() {
  return Response.json(getThreads());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, body: text, author, category } = body;
  if (!title || !text || !author || !category) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const thread = createThread({ title, body: text, author, category });
  return Response.json({ thread }, { status: 201 });
}
