import { getEntries, addEntry, deleteEntry } from '../../../lib/store';
import { WeatherEntry } from '../../../lib/types';

export function GET(): Response {
  return Response.json({ entries: getEntries() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { date, temperature, condition, humidity, notes } = body;
  try {
    const entry = addEntry(date, Number(temperature), condition as WeatherEntry['condition'], Number(humidity), notes ?? '');
    return Response.json({ entry }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteEntry(id);
  return Response.json({ ok: true });
}
