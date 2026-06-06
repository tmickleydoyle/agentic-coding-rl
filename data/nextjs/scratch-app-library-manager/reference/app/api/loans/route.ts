import { getLoans, addLoan } from '../../../lib/store'

export async function GET() {
  return Response.json(getLoans())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { bookId, memberId, dueDate } = body
  if (!bookId || !memberId || !dueDate) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }
  const loan = addLoan({ bookId, memberId, dueDate })
  return Response.json(loan, { status: 201 })
}
