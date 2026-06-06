import { getBooks, addBook } from '../../../lib/store'

export async function GET() {
  return Response.json(getBooks())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { title, author, isbn, genre } = body
  if (!title || !author || !isbn || !genre) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }
  const book = addBook({ title, author, isbn, genre })
  return Response.json(book, { status: 201 })
}
