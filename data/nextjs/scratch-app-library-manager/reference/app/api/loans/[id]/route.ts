import { returnLoan } from '../../../../lib/store'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const loan = returnLoan(params.id)
  if (!loan) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(loan)
}
