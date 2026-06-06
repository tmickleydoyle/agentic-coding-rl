"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ReviewsPage() {
  const { movies, setMovies } = useApp();
  const watched = movies.filter((m) => m.status === "watched");
  const [selectedId, setSelectedId] = useState<string>("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    const res = await fetch("/api/movies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, rating: Number(rating), review: reviewText }),
    });
    const updated = await res.json();
    setMovies((prev) => prev.map((m) => (m.id === selectedId ? updated : m)));
    setSelectedId(""); setRating(""); setReviewText("");
  }

  return (
    <div data-testid="reviews-page">
      <h2>Reviews</h2>
      <form data-testid="review-form" onSubmit={handleSubmit}>
        <select data-testid="select-movie" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
          <option value="">Select a movie</option>
          {watched.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <input data-testid="input-rating" type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating (1-5)" required />
        <textarea data-testid="input-review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Your review" required />
        <button type="submit" data-testid="btn-submit-review">Submit Review</button>
      </form>
      <ul data-testid="reviews-list">
        {watched.filter((m) => m.review).map((m) => (
          <li key={m.id} data-testid={`review-item-${m.id}`}>
            <span data-testid={`review-title-${m.id}`}>{m.title}</span>
            <span data-testid={`review-rating-${m.id}`}>{m.rating}/5</span>
            <span data-testid={`review-text-${m.id}`}>{m.review}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
