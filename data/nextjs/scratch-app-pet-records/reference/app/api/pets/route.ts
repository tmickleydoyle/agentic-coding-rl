import { getPets, addPet, deletePet } from '../../../lib/store';
import type { Pet } from '../../../lib/types';

export function GET() {
  return Response.json(getPets());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, species, birthDate, weight } = body;
  if (!name || !species) return Response.json({ error: 'name and species required' }, { status: 400 });
  const p = addPet({ name, species, birthDate: birthDate || '', weight: Number(weight) || 0 } as Omit<Pet, 'id'>);
  return Response.json(p, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  deletePet(id);
  return Response.json({ ok: true });
}
