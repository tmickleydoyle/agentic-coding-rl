'use client'
import React from 'react'
export function ReviewsPage() { return <div><h1>Reviews</h1><ul data-testid="review-list"></ul><form data-testid="add-review-form"><select data-testid="review-book-select"></select><select data-testid="review-member-select"></select><input data-testid="review-rating-input" type="number"/><input data-testid="review-text-input" placeholder="Text"/><input data-testid="review-date-input" type="date"/><button data-testid="submit-review" type="submit">Add</button></form></div> }
