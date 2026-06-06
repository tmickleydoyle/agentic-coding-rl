import { course, modules, lessons, addModule, deleteModule, addLesson, togglePublish } from '../../../lib/store';

export async function GET(_req: Request): Promise<Response> {
  return Response.json({ course, modules, lessons });
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'module') {
    if (!body.title || !body.title.trim()) return new Response('Bad Request', { status: 400 });
    const mod = addModule(body.title.trim());
    return Response.json(mod, { status: 201 });
  }

  if (type === 'lesson') {
    const { moduleId, title, type: lessonType, duration } = body;
    if (!title || !moduleId || !duration || Number(duration) <= 0) return new Response('Bad Request', { status: 400 });
    const lesson = addLesson(Number(moduleId), title, lessonType || 'video', Number(duration));
    return Response.json(lesson, { status: 201 });
  }

  return new Response('Bad Request', { status: 400 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'module') {
    const ok = deleteModule(Number(body.id));
    if (!ok) return new Response('Not Found', { status: 404 });
    return new Response(null, { status: 204 });
  }

  return new Response('Bad Request', { status: 400 });
}

export async function PATCH(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');

  if (type === 'publish') {
    const updated = togglePublish();
    return Response.json(updated);
  }

  return new Response('Bad Request', { status: 400 });
}
