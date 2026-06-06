'use client'
import React, { useEffect, useState } from 'react'
import { Review, Book, Member } from '../../lib/types'
export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [bookId,setBookId] = useState(''), [memberId,setMemberId] = useState(''), [rating,setRating] = useState('5'), [text,setText] = useState(''), [date,setDate] = useState('')
  function load() {
    fetch('/api/reviews').then(r=>r.json()).then(setReviews)
    fetch('/api/books').then(r=>r.json()).then((bs: Book[])=>{ setBooks(bs); if(bs.length>0&&!bookId) setBookId(bs[0].id) })
    fetch('/api/members').then(r=>r.json()).then((ms: Member[])=>{ setMembers(ms); if(ms.length>0&&!memberId) setMemberId(ms[0].id) })
  }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bookId,memberId,rating:Number(rating),text,date})})
      .then(()=>{setText('');setDate('');load()})
  }
  return <div style={{padding:'2rem'}}><h1>Reviews</h1>
    <ul data-testid="review-list" style={{listStyle:'none',padding:0}}>
      {reviews.map(r=><li key={r.id} data-testid="review-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{r.bookTitle}</strong> by {r.memberName} — ⭐{r.rating} | {r.text} | {r.date}
      </li>)}
    </ul>
    <h2>Add Review</h2>
    <form data-testid="add-review-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <select data-testid="review-book-select" value={bookId} onChange={e=>setBookId(e.target.value)}>{books.map(b=><option key={b.id} value={b.id}>{b.title}</option>)}</select>
      <select data-testid="review-member-select" value={memberId} onChange={e=>setMemberId(e.target.value)}>{members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
      <input data-testid="review-rating-input" type="number" min="1" max="5" value={rating} onChange={e=>setRating(e.target.value)} required/>
      <input data-testid="review-text-input" placeholder="Review text" value={text} onChange={e=>setText(e.target.value)} required/>
      <input data-testid="review-date-input" type="date" value={date} onChange={e=>setDate(e.target.value)} required/>
      <button data-testid="submit-review" type="submit">Add Review</button>
    </form>
  </div>
}
