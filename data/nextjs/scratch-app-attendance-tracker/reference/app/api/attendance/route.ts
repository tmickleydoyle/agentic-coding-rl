import { students, records, addStudent, removeStudent, saveAttendance } from '../../../lib/store';
import type { AttendanceStatus } from '../../../lib/types';

const VALID_STATUSES: AttendanceStatus[] = ['present', 'absent', 'late'];

export async function GET(_req: Request): Promise<Response> {
  return Response.json({ students, records });
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'student') {
    if (!body.name || !body.name.trim()) return new Response('Bad Request', { status: 400 });
    const student = addStudent(body.name);
    return Response.json(student, { status: 201 });
  }

  if (type === 'records') {
    const { date, records: entries } = body;
    if (!date || !entries) return new Response('Bad Request', { status: 400 });
    for (const e of entries) {
      if (!VALID_STATUSES.includes(e.status)) return new Response('Bad Request', { status: 400 });
    }
    const newRecords = saveAttendance(date, entries);
    return Response.json(newRecords, { status: 201 });
  }

  return new Response('Bad Request', { status: 400 });
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
