import { skills, paths, progress, updateSkillStatus } from '../../../lib/store';
import type { SkillStatus } from '../../../lib/types';

export async function GET(_req: Request): Promise<Response> {
  return Response.json({ skills, paths, progress });
}

export async function PATCH(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const body = await req.json();

  if (type === 'progress') {
    const { skillId, status } = body as { skillId: number; status: SkillStatus };
    const current = progress.find((p) => p.skillId === Number(skillId));
    if (!current) return new Response('Not Found', { status: 404 });
    if (current.status === 'locked' && status === 'completed') return new Response('Cannot complete locked skill', { status: 400 });
    if (current.status === 'completed' && status === 'in_progress') return new Response('Cannot restart completed skill', { status: 400 });
    const updated = updateSkillStatus(Number(skillId), status);
    return Response.json(updated);
  }

  return new Response('Bad Request', { status: 400 });
}
