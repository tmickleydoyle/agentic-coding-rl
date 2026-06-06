import { getDecks, getCards, addDeck, deleteDeck } from '../../../lib/store';

export function GET() {
  const decks = getDecks();
  const cards = getCards();
  const result = decks.map(d => ({ ...d, cards: cards.filter(c => c.deckId === d.id) }));
  return Response.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, language } = body;
  if (!name || !language) return Response.json({ error: 'name and language required' }, { status: 400 });
  const d = addDeck({ name, language });
  return Response.json(d, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  deleteDeck(id);
  return Response.json({ ok: true });
}
