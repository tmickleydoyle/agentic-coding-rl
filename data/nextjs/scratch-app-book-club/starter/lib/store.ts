import { Book, Review, Member } from './types'
export function getBooks(): Book[] { return [] }
export function addBook(_d: Omit<Book,'id'>): Book { return { id:'',title:'',author:'',genre:'',year:0,status:'wishlist' } }
export function deleteBook(_id: string): boolean { return false }
export function getReviews(): Review[] { return [] }
export function addReview(_d: Omit<Review,'id'>): Review { return { id:'',bookId:'',bookTitle:'',memberId:'',memberName:'',rating:0,text:'',date:'' } }
export function getMembers(): Member[] { return [] }
export function addMember(_d: Omit<Member,'id'>): Member { return { id:'',name:'',joinDate:'' } }
export function __reset() {}
