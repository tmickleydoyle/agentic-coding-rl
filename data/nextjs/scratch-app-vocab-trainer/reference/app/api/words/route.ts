import { getWords, addWord, deleteWord } from '../../../lib/store';

export function GET(): Response {
  return Response.json({ words: getWords() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { term, definition, category } = body;
  try {
    const word = addWord(term, definition, category ?? 'general');
    return Response.json({ word }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteWord(id);
  return Response.json({ ok: true });
}
