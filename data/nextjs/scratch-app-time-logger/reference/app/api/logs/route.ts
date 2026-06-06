import { getEntries, addEntry, deleteEntry, getProjects, addProject } from '../../../lib/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  if (type === 'projects') return Response.json(getProjects());
  return Response.json(getEntries());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.type === 'project') {
    if (!body.name || !body.name.trim()) return Response.json({ error: 'Name required' }, { status: 400 });
    const result = addProject({ name: body.name.trim(), color: body.color ?? '#6b7280' });
    if (!result) return Response.json({ error: 'Project already exists' }, { status: 409 });
    return Response.json(result, { status: 201 });
  }
  if (!body.description || !body.description.trim()) return Response.json({ error: 'Description required' }, { status: 400 });
  if (typeof body.hours !== 'number' || body.hours <= 0) return Response.json({ error: 'Hours must be positive' }, { status: 400 });
  const entry = addEntry({ projectId: body.projectId, description: body.description.trim(), hours: body.hours, date: body.date ?? new Date().toISOString().slice(0, 10) });
  return Response.json(entry, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const ok = deleteEntry(id);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}
