'use client'
import React from 'react'

export function BooksPage() {
  return (
    <div>
      <h1>Books</h1>
      <form data-testid="add-book-form">
        <input data-testid="input-title" placeholder="Title" />
        <input data-testid="input-author" placeholder="Author" />
        <input data-testid="input-isbn" placeholder="ISBN" />
        <input data-testid="input-genre" placeholder="Genre" />
        <button data-testid="btn-add-book" type="submit">Add Book</button>
      </form>
      <ul data-testid="book-list"></ul>
    </div>
  )
}
