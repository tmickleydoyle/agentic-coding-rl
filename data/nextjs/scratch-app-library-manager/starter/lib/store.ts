import { Book, Member, Loan } from './types'

export function __reset() {}

export function getBooks(): Book[] { return [] }
export function addBook(_data: Omit<Book, 'id' | 'available'>): Book { return {} as Book }
export function getMembers(): Member[] { return [] }
export function addMember(_data: Omit<Member, 'id'>): Member { return {} as Member }
export function getLoans(): Loan[] { return [] }
export function addLoan(_data: { bookId: string; memberId: string; dueDate: string }): Loan { return {} as Loan }
export function returnLoan(_id: string): Loan | null { return null }
