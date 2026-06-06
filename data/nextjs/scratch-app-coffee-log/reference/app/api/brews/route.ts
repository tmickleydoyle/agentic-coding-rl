import { getBrews, addBrew, deleteBrew } from '../../../lib/store';
import type { Brew } from '../../../lib/types';

export function GET() {
  return Response.json(getBrews());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { beanId, method, date, rating, notes } = body;
  if (!beanId || !method || !date || !rating) {
    return Response.json({ error: 'beanId, method, date, rating required' }, { status: 400 });
  }
  const br = addBrew({ beanId, method, date, rating: Number(rating), notes: notes || '' } as Omit<Brew, 'id'>);
  return Response.json(br, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  deleteBrew(id);
  return Response.json({ ok: true });
}
