import { getPlants, addPlant, deletePlant } from '../../../lib/store';
import type { Plant } from '../../../lib/types';

export function GET() {
  return Response.json(getPlants());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, type, sunlight, wateringFrequency } = body;
  if (!name || !type || !sunlight || !wateringFrequency) {
    return Response.json({ error: 'All fields required' }, { status: 400 });
  }
  const p = addPlant({ name, type, sunlight, wateringFrequency } as Omit<Plant, 'id'>);
  return Response.json(p, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  deletePlant(id);
  return Response.json({ ok: true });
}
