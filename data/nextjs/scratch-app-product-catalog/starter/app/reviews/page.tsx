'use client'
import React from 'react'
export function ReviewsPage() {
  return (
    <div>
      <h1>Reviews</h1>
      <form data-testid="add-review-form">
        <select data-testid="select-review-product"><option value="">Select product</option></select>
        <input data-testid="input-review-rating" type="number" min="1" max="5" />
        <input data-testid="input-review-comment" placeholder="Comment" />
        <input data-testid="input-review-reviewer" placeholder="Your name" />
        <button data-testid="btn-add-review" type="submit">Add Review</button>
      </form>
      <ul data-testid="review-list"></ul>
    </div>
  )
}
