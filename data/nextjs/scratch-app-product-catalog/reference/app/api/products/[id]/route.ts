import { toggleProduct } from '../../../../lib/store'

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const p = toggleProduct(params.id)
  if (!p) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(p)
}
