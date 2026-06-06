import type { Book, ReadingStatus } from "./types";

export function getBooks(): Book[] {
  return [];
}

export function addBook(_data: Omit<Book, "id" | "addedAt" | "status">): Book {
  throw new Error("Not implemented");
}

export function updateBookStatus(_id: string, _status: ReadingStatus): Book | null {
  return null;
}

export function removeBook(_id: string): boolean {
  return false;
}

export function __reset(): void {}
