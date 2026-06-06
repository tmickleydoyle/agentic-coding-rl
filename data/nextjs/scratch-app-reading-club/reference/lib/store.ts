import type { Book, ReadingStatus } from "./types";

let books: Book[] = [
  { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", pages: 180, status: "read", addedAt: "2024-01-01" },
  { id: "2", title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", pages: 688, status: "reading", addedAt: "2024-01-15" },
];

let nextId = 3;

export function getBooks(): Book[] {
  return books;
}

export function addBook(data: Omit<Book, "id" | "addedAt" | "status">): Book {
  const book: Book = {
    id: String(nextId++),
    ...data,
    status: "want-to-read",
    addedAt: new Date().toISOString().slice(0, 10),
  };
  books.push(book);
  return book;
}

export function updateBookStatus(id: string, status: ReadingStatus): Book | null {
  const book = books.find((b) => b.id === id);
  if (!book) return null;
  book.status = status;
  return book;
}

export function removeBook(id: string): boolean {
  const before = books.length;
  books = books.filter((b) => b.id !== id);
  return books.length < before;
}

export function __reset(): void {
  books = [
    { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", pages: 180, status: "read", addedAt: "2024-01-01" },
    { id: "2", title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", pages: 688, status: "reading", addedAt: "2024-01-15" },
  ];
  nextId = 3;
}
