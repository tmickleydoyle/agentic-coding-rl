import { getCards, addCard, deleteCard } from '../../../lib/store';

export function GET(req: Request): Response {
  const url = new URL(req.url);
  const deckId = url.searchParams.get('deckId') ?? undefined;
  return Response.json({ cards: getCards(deckId) });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { deckId, front, back } = body;
  try {
    const card = addCard(deckId, front, back);
    return Response.json({ card }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteCard(id);
  return Response.json({ ok: true });
}
