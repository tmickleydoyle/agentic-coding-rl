import { student, courses, progressRecords, updateStudentName, enrollCourse, dropCourse } from '../../../lib/store';

export async function GET(_req: Request): Promise<Response> {
  return Response.json({ student, courses, progress: progressRecords });
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'enroll') {
    const course = courses.find((c) => c.id === body.courseId);
    if (course && course.enrolled) return new Response('Conflict', { status: 409 });
    const ok = enrollCourse(Number(body.courseId));
    if (!ok) return new Response('Bad Request', { status: 400 });
    return Response.json({ success: true });
  }

  if (type === 'drop') {
    const ok = dropCourse(Number(body.courseId));
    if (!ok) return new Response('Bad Request', { status: 400 });
    return Response.json({ success: true });
  }

  return new Response('Bad Request', { status: 400 });
}

export async function PATCH(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'profile') {
    if (!body.name || !body.name.trim()) return new Response('Bad Request', { status: 400 });
    updateStudentName(body.name.trim());
    return Response.json({ success: true });
  }

  return new Response('Bad Request', { status: 400 });
}
