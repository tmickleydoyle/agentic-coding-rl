import { getApplications, addApplication, updateApplicationStatus, deleteApplication } from '../../../lib/store';
import type { AppStatus } from '../../../lib/types';

export function GET() {
  return Response.json(getApplications());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { company, role, status, appliedDate, url } = body;
  if (!company || !role || !appliedDate) {
    return Response.json({ error: 'company, role, and appliedDate required' }, { status: 400 });
  }
  const a = addApplication({ company, role, status: status || 'applied', appliedDate, url: url || '' });
  return Response.json(a, { status: 201 });
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const body = await req.json();
  updateApplicationStatus(id, body.status as AppStatus);
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  deleteApplication(id);
  return Response.json({ ok: true });
}
