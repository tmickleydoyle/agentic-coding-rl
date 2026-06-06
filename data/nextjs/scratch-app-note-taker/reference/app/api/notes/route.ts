import { getNotes, addNote, deleteNote, setArchived } from '../../../lib/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const archived = url.searchParams.get('archived');
  const notes = getNotes();
  if (archived === 'true') return Response.json(notes.filter(n => n.archived));
  if (archived === 'false') return Response.json(notes.filter(n => !n.archived));
  return Response.json(notes);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title || !body.title.trim()) return Response.json({ error: 'Title required' }, { status: 400 });
  const now = new Date().toISOString();
  const note = addNote({ title: body.title.trim(), body: body.body ?? '', tags: body.tags ?? [], archived: false, createdAt: now, updatedAt: now });
  return Response.json(note, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const ok = deleteNote(id);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const body = await request.json();
  const ok = setArchived(id, !!body.archived);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}
