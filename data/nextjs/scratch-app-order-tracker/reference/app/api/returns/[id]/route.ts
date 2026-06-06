import { updateReturnStatus } from '../../../../lib/store'
import { Return } from '../../../../lib/types'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  const r = updateReturnStatus(params.id, status as Return['status'])
  if (!r) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(r)
}
