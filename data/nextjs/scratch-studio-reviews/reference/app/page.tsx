import React, { useState } from "react";

interface StudioReview {
  id: number;
  studio: string;
  city: string;
  rating: number;
  review: string;
  type: string;
}

const SEED_REVIEWS: StudioReview[] = [
  { id: 1, studio: "Ink & Iron", city: "Portland", rating: 5, review: "Incredible artists, super clean", type: "Tattoo" },
  { id: 2, studio: "Sacred Skin", city: "Seattle", rating: 4, review: "Great vibe, minor wait time", type: "Piercing" },
  { id: 3, studio: "Blackout Tattoo", city: "Austin", rating: 3, review: "Average work, good price", type: "Tattoo" },
  { id: 4, studio: "Body Canvas", city: "Denver", rating: 5, review: "Best piercer I have visited", type: "Piercing" },
];

export default function App() {
  const [reviews, setReviews] = useState<StudioReview[]>(SEED_REVIEWS);
  const [studio, setStudio] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [type, setType] = useState("Tattoo");
  const [minRating, setMinRating] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [nextId, setNextId] = useState(5);

  const handleAdd = () => {
    if (!studio.trim() || !city.trim() || !review.trim()) return;
    const newReview: StudioReview = {
      id: nextId,
      studio: studio.trim(),
      city: city.trim(),
      rating,
      review: review.trim(),
      type,
    };
    setReviews([...reviews, newReview]);
    setNextId(nextId + 1);
    setStudio("");
    setCity("");
    setRating(5);
    setReview("");
    setType("Tattoo");
  };

  const deleteReview = (id: number) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const minRatingNum = minRating === "All" ? 1 : parseInt(minRating.replace("+", ""), 10);

  const visible = reviews.filter((r) => {
    const matchesRating = r.rating >= minRatingNum;
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    return matchesRating && matchesType;
  });

  const avgRating =
    visible.length === 0
      ? "N/A"
      : (visible.reduce((sum, r) => sum + r.rating, 0) / visible.length).toFixed(1);

  const stars = (count: number) => "★".repeat(count) + "☆".repeat(5 - count);

  return (
    <div>
      <h1>Studio Reviews</h1>

      <div data-testid="add-form">
        <input
          data-testid="studio-input"
          placeholder="Studio name"
          value={studio}
          onChange={(e) => setStudio(e.target.value)}
        />
        <input
          data-testid="city-input"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          data-testid="rating-input"
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Math.min(5, Math.max(1, Number(e.target.value))))}
        />
        <textarea
          data-testid="review-input"
          placeholder="Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <select
          data-testid="type-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Tattoo">Tattoo</option>
          <option value="Piercing">Piercing</option>
        </select>
        <button data-testid="add-button" onClick={handleAdd}>
          Add Review
        </button>
      </div>

      <div data-testid="filter-section">
        <select
          data-testid="min-rating-filter"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="All">All</option>
          <option value="2+">2+</option>
          <option value="3+">3+</option>
          <option value="4+">4+</option>
          <option value="5">5</option>
        </select>
        <select
          data-testid="type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Tattoo">Tattoo</option>
          <option value="Piercing">Piercing</option>
        </select>
      </div>

      <div data-testid="average-rating">Avg: {avgRating}</div>

      <div data-testid="reviews-list">
        {visible.map((r) => (
          <div key={r.id} data-testid="review-card">
            <span data-testid="studio-name">{r.studio}</span>
            <span data-testid="studio-city">{r.city}</span>
            <span data-testid="studio-type">{r.type}</span>
            <span data-testid="star-rating">{stars(r.rating)}</span>
            <span data-testid="review-text">{r.review}</span>
            <button
              data-testid="delete-button"
              onClick={() => deleteReview(r.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
