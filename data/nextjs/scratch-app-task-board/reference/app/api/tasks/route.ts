import { getTasks, addTask, moveForward, reopenTask } from '../../../lib/store';

export async function GET() { return Response.json(getTasks()); }

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title || !body.title.trim()) return Response.json({ error: 'Title required' }, { status: 400 });
  const task = addTask({ title: body.title.trim(), description: body.description ?? '', status: 'todo', label: body.label ?? '', priority: body.priority ?? 'medium' });
  return Response.json(task, { status: 201 });
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  if (action === 'reopen') {
    const ok = reopenTask(id);
    if (!ok) return Response.json({ error: 'Not found or not done' }, { status: 404 });
  } else {
    const ok = moveForward(id);
    if (!ok) return Response.json({ error: 'Not found or already done' }, { status: 404 });
  }
  return Response.json({ success: true });
}
