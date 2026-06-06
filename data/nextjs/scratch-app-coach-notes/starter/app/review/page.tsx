import React from "react";

export default function ReviewPage() {
  return (
    <div data-testid="review-page">
      <h1>Review</h1>
      <p data-testid="review-total-sessions">Total Sessions: 0</p>
      <p data-testid="review-total-minutes">Total Minutes: 0</p>
      <ul data-testid="review-athletes-list"></ul>
    </div>
  );
}
