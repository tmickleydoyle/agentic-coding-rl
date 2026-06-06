export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  genre: string
  available: boolean
}

export interface Member {
  id: string
  name: string
  email: string
  membershipId: string
  joinDate: string
}

export interface Loan {
  id: string
  bookId: string
  memberId: string
  loanDate: string
  dueDate: string
  returned: boolean
}

export type Route = 'home' | 'books' | 'members' | 'loans'
