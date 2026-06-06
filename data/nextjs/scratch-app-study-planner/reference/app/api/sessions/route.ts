import { getSessions, addSession, deleteSession } from '../../../lib/store';

export function GET(): Response {
  return Response.json({ sessions: getSessions() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { subjectId, date, durationMinutes, notes } = body;
  try {
    const session = addSession(subjectId, date, Number(durationMinutes), notes ?? '');
    return Response.json({ session }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteSession(id);
  return Response.json({ ok: true });
}
