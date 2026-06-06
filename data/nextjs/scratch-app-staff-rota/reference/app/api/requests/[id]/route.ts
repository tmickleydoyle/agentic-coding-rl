import { updateRequestStatus } from '../../../../lib/store'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  const r = updateRequestStatus(params.id, status)
  if (!r) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(r)
}
