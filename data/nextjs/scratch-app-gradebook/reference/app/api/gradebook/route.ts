import { students, grades, subjects, addStudent, removeStudent, addGrade } from '../../../lib/store';

export async function GET(_req: Request): Promise<Response> {
  return Response.json({ students, grades, subjects });
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'grade') {
    const { studentId, subject, score, maxScore } = body;
    if (score < 0 || score > 100) return new Response('Bad Request', { status: 400 });
    const grade = addGrade(Number(studentId), subject, Number(score), Number(maxScore ?? 100));
    return Response.json(grade, { status: 201 });
  }

  // default: student
  const { name } = body;
  if (!name || !name.trim()) return new Response('Bad Request', { status: 400 });
  const student = addStudent(name);
  return Response.json(student, { status: 201 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'student') {
    const ok = removeStudent(Number(body.id));
    if (!ok) return new Response('Not Found', { status: 404 });
    return new Response(null, { status: 204 });
  }

  return new Response('Bad Request', { status: 400 });
}
