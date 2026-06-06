import { classroom, students, assignments, addStudent, removeStudent, addAssignment } from '../../../lib/store';

export async function GET(_req: Request): Promise<Response> {
  return Response.json({ classroom, students, assignments });
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'assignment') {
    const { name, dueDate } = body;
    if (!name || !dueDate) return new Response('Bad Request', { status: 400 });
    const assignment = addAssignment(name, dueDate);
    return Response.json(assignment, { status: 201 });
  }

  // default: add student
  const { name } = body;
  if (!name || !name.trim()) return new Response('Bad Request', { status: 400 });
  const student = addStudent(name);
  return Response.json(student, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const body = await req.json();
  const { id } = body;
  const ok = removeStudent(Number(id));
  if (!ok) return new Response('Not Found', { status: 404 });
  return new Response(null, { status: 204 });
}
