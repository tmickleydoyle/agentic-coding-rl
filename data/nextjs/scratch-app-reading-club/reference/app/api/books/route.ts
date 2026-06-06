import { getBooks, addBook, updateBookStatus, removeBook } from "../../../lib/store";

export function GET() {
  return Response.json(getBooks());
}

export async function POST(req: Request) {
  const { title, author, genre, pages } = await req.json();
  const book = addBook({ title, author, genre, pages });
  return Response.json(book, { status: 201 });
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const book = updateBookStatus(id, status);
  if (!book) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(book);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = removeBook(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
