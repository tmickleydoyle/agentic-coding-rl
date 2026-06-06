import { updateOrderStatus } from '../../../../lib/store'
import { Order } from '../../../../lib/types'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  const o = updateOrderStatus(params.id, status as Order['status'])
  if (!o) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(o)
}
