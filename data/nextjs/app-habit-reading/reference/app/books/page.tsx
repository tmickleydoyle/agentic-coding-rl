'use client'
import { useReading } from '../../components/ReadingProvider'
import { booksFinished } from '../../hooks/useReadingStats'

export default function BooksPage() {
  const { books, toggleBook } = useReading()
  return (
    <section data-testid="page-books">
      <h1>Books</h1>
      <p data-testid="books-finished">{booksFinished(books)}</p>
      {books.length === 0 ? (
        <p data-testid="empty-state">No books yet.</p>
      ) : (
        <ul data-testid="book-list">
          {books.map((b) => (
            <li key={b.id} data-testid={`book-${b.id}`} data-done={b.done ? 'true' : 'false'}>
              <span data-testid={`book-${b.id}-title`}>{b.title}</span>
              <button data-testid={`toggle-book-${b.id}`} onClick={() => toggleBook(b.id)}>
                {b.done ? 'Mark unread' : 'Mark read'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
