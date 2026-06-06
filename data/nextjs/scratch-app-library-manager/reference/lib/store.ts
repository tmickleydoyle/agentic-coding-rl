import { Book, Member, Loan } from './types'

const seedBooks: Book[] = [
  { id: 'b1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', genre: 'Fiction', available: true },
  { id: 'b2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', genre: 'Fiction', available: false },
  { id: 'b3', title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', genre: 'Dystopian', available: true },
  { id: 'b4', title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0-06-085052-4', genre: 'Dystopian', available: true },
  { id: 'b5', title: 'Fahrenheit 451', author: 'Ray Bradbury', isbn: '978-1-4516-7331-9', genre: 'Dystopian', available: false },
]

const seedMembers: Member[] = [
  { id: 'm1', name: 'Alice Johnson', email: 'alice@library.com', membershipId: 'LIB001', joinDate: '2023-01-15' },
  { id: 'm2', name: 'Bob Smith', email: 'bob@library.com', membershipId: 'LIB002', joinDate: '2023-03-22' },
  { id: 'm3', name: 'Carol White', email: 'carol@library.com', membershipId: 'LIB003', joinDate: '2023-06-10' },
]

const seedLoans: Loan[] = [
  { id: 'l1', bookId: 'b2', memberId: 'm1', loanDate: '2024-01-10', dueDate: '2024-01-24', returned: false },
  { id: 'l2', bookId: 'b5', memberId: 'm2', loanDate: '2024-01-15', dueDate: '2024-01-29', returned: false },
]

let books: Book[] = seedBooks.map(b => ({ ...b }))
let members: Member[] = seedMembers.map(m => ({ ...m }))
let loans: Loan[] = seedLoans.map(l => ({ ...l }))
let nextId = 100

export function __reset() {
  books = seedBooks.map(b => ({ ...b }))
  members = seedMembers.map(m => ({ ...m }))
  loans = seedLoans.map(l => ({ ...l }))
  nextId = 100
}

export function getBooks(): Book[] {
  return books
}

export function addBook(data: Omit<Book, 'id' | 'available'>): Book {
  const book: Book = { ...data, id: `b${nextId++}`, available: true }
  books.push(book)
  return book
}

export function getMembers(): Member[] {
  return members
}

export function addMember(data: Omit<Member, 'id'>): Member {
  const member: Member = { ...data, id: `m${nextId++}` }
  members.push(member)
  return member
}

export function getLoans(): Loan[] {
  return loans.filter(l => !l.returned)
}

export function addLoan(data: { bookId: string; memberId: string; dueDate: string }): Loan {
  const today = new Date().toISOString().slice(0, 10)
  const loan: Loan = { ...data, id: `l${nextId++}`, loanDate: today, returned: false }
  loans.push(loan)
  const book = books.find(b => b.id === data.bookId)
  if (book) book.available = false
  return loan
}

export function returnLoan(id: string): Loan | null {
  const loan = loans.find(l => l.id === id)
  if (!loan) return null
  loan.returned = true
  const book = books.find(b => b.id === loan.bookId)
  if (book) book.available = true
  return loan
}
