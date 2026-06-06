import { getVehicles, addVehicle, updateMileage, deleteVehicle } from '../../../lib/store';

export function GET() {
  return Response.json(getVehicles());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { make, model, year, mileage } = body;
  if (!make || !model || Number(year) <= 0) {
    return Response.json({ error: 'make, model, and year required' }, { status: 400 });
  }
  const v = addVehicle({ make, model, year: Number(year), mileage: Number(mileage) || 0 });
  return Response.json(v, { status: 201 });
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const body = await req.json();
  updateMileage(id, Number(body.mileage));
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  deleteVehicle(id);
  return Response.json({ ok: true });
}
