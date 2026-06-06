import { toggleSupplier } from '../../../../lib/store'

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const s = toggleSupplier(params.id)
  if (!s) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(s)
}
