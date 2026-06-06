import { skills, certificates, addSkill, deleteSkill, issueCertificate } from '../../../lib/store';

export async function GET(_req: Request): Promise<Response> {
  return Response.json({ skills, certificates });
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'skill') {
    const { name, category, requiredHours } = body;
    if (!name || !category || !requiredHours) return new Response('Bad Request', { status: 400 });
    const skill = addSkill(name, category, Number(requiredHours));
    return Response.json(skill, { status: 201 });
  }

  if (type === 'certificate') {
    const { skillId, recipientName, issuedDate, hoursCompleted } = body;
    if (!skillId || !recipientName || !issuedDate || hoursCompleted === undefined) return new Response('Bad Request', { status: 400 });
    const cert = issueCertificate(Number(skillId), recipientName, issuedDate, Number(hoursCompleted));
    if (!cert) return new Response('Insufficient hours', { status: 400 });
    return Response.json(cert, { status: 201 });
  }

  return new Response('Bad Request', { status: 400 });
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'skill') {
    const result = deleteSkill(Number(body.id));
    if (result === 'not_found') return new Response('Not Found', { status: 404 });
    if (result === 'has_certificates') return new Response('Cannot delete skill with existing certificates', { status: 400 });
    return new Response(null, { status: 204 });
  }

  return new Response('Bad Request', { status: 400 });
}
