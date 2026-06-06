import { Book, Review, Member } from './types'
let books: Book[] = [
  { id: 'b1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', year: 1925, status: 'finished' },
  { id: 'b2', title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', year: 1965, status: 'reading' },
  { id: 'b3', title: 'Atomic Habits', author: 'James Clear', genre: 'Non-Fiction', year: 2018, status: 'wishlist' },
]
let reviews: Review[] = [
  { id: 'r1', bookId: 'b1', bookTitle: 'The Great Gatsby', memberId: 'm1', memberName: 'Sarah Connor', rating: 5, text: 'A masterpiece', date: '2024-03-01' },
  { id: 'r2', bookId: 'b2', bookTitle: 'Dune', memberId: 'm2', memberName: 'John Wick', rating: 4, text: 'Epic world-building', date: '2024-04-10' },
]
let members: Member[] = [
  { id: 'm1', name: 'Sarah Connor', joinDate: '2024-01-01' },
  { id: 'm2', name: 'John Wick', joinDate: '2024-02-15' },
]
let nextId = 100
function uid() { return String(++nextId) }
export function getBooks() { return [...books] }
export function addBook(d: Omit<Book,'id'>): Book { const b = { id: uid(), ...d }; books.push(b); return b }
export function deleteBook(id: string): boolean { const l = books.length; books = books.filter(b => b.id !== id); return books.length < l }
export function getReviews() { return [...reviews] }
export function addReview(d: Omit<Review,'id'>): Review { const r = { id: uid(), ...d }; reviews.push(r); return r }
export function getMembers() { return [...members] }
export function addMember(d: Omit<Member,'id'>): Member { const m = { id: uid(), ...d }; members.push(m); return m }
export function __reset() {
  books = [
    { id: 'b1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', year: 1925, status: 'finished' },
    { id: 'b2', title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', year: 1965, status: 'reading' },
    { id: 'b3', title: 'Atomic Habits', author: 'James Clear', genre: 'Non-Fiction', year: 2018, status: 'wishlist' },
  ]
  reviews = [
    { id: 'r1', bookId: 'b1', bookTitle: 'The Great Gatsby', memberId: 'm1', memberName: 'Sarah Connor', rating: 5, text: 'A masterpiece', date: '2024-03-01' },
    { id: 'r2', bookId: 'b2', bookTitle: 'Dune', memberId: 'm2', memberName: 'John Wick', rating: 4, text: 'Epic world-building', date: '2024-04-10' },
  ]
  members = [
    { id: 'm1', name: 'Sarah Connor', joinDate: '2024-01-01' },
    { id: 'm2', name: 'John Wick', joinDate: '2024-02-15' },
  ]
  nextId = 100
}
