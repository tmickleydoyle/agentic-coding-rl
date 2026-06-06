import { closeTicket } from '../../../../lib/store'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const t = closeTicket(params.id)
  if (!t) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(t)
}
