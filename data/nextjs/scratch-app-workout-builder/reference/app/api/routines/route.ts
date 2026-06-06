import { getRoutines, addRoutine, deleteRoutine } from '../../../lib/store';

export function GET(): Response {
  return Response.json({ routines: getRoutines() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, exerciseIds, estimatedMinutes } = body;
  try {
    const routine = addRoutine(name, exerciseIds ?? [], Number(estimatedMinutes) || 0);
    return Response.json({ routine }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteRoutine(id);
  return Response.json({ ok: true });
}
