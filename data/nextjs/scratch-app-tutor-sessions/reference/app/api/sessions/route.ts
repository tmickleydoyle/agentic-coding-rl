import { tutors, sessions, bookSession, updateSessionStatus } from '../../../lib/store';
import type { SessionStatus } from '../../../lib/types';

const VALID_DURATIONS = [30, 45, 60, 90];

export async function GET(_req: Request): Promise<Response> {
  return Response.json({ tutors, sessions });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { tutorId, studentName, date, time, duration } = body;
  if (!tutorId || !studentName || !date || !time || !duration) return new Response('Bad Request', { status: 400 });
  if (!VALID_DURATIONS.includes(Number(duration))) return new Response('Bad Request', { status: 400 });
  const tutor = tutors.find((t) => t.id === Number(tutorId));
  if (!tutor) return new Response('Not Found', { status: 404 });
  if (!tutor.available) return new Response('Bad Request', { status: 400 });
  const session = bookSession(Number(tutorId), studentName, date, time, Number(duration));
  return Response.json(session, { status: 201 });
}

export async function PATCH(req: Request): Promise<Response> {
  const body = await req.json();
  const { id, status } = body as { id: number; status: SessionStatus };
  const session = sessions.find((s) => s.id === Number(id));
  if (!session) return new Response('Not Found', { status: 404 });
  if (status === 'cancelled' && session.status === 'cancelled') return new Response('Bad Request', { status: 400 });
  const updated = updateSessionStatus(Number(id), status);
  return Response.json(updated);
}
