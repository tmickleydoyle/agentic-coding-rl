import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ReviewsPage() {
  const { reviews } = useApp();
  return (
    <div data-testid="reviews-page">
      <h2>All Reviews</h2>
      {reviews.map((r) => (
        <div key={r.id} data-testid="review-card">
          <span data-testid="review-hostel">{r.hostelName}</span>
          <span data-testid="review-city">{r.city}</span>
          <span data-testid="review-rating">{r.rating}</span>
          <span data-testid="review-date">{r.date}</span>
          <span data-testid="review-comment">{r.comment}</span>
        </div>
      ))}
    </div>
  );
}
