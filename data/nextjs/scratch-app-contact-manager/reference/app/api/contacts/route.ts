import { getContacts, addContact, deleteContact, searchContacts } from '../../../lib/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  if (q !== null) return Response.json(searchContacts(q));
  return Response.json(getContacts());
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = addContact(body);
  if ('error' in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json(result, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const ok = deleteContact(id);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}
