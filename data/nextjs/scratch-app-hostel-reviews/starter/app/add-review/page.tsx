import React from "react";

export default function AddReviewPage() {
  return (
    <div data-testid="add-review-page">
      <input data-testid="input-hostel-name" />
      <input data-testid="input-city" />
      <input data-testid="input-country" />
      <input data-testid="input-rating" type="number" />
      <input data-testid="input-cleanliness" type="number" />
      <input data-testid="input-location" type="number" />
      <input data-testid="input-value" type="number" />
      <input data-testid="input-date" type="date" />
      <textarea data-testid="input-comment" />
      <button data-testid="submit-review">Save Review</button>
    </div>
  );
}
