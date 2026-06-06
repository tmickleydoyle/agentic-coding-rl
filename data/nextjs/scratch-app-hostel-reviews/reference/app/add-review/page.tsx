import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { HostelReview } from "../../lib/types";

let clientId = 100;

export default function AddReviewPage() {
  const { navigate, addReview } = useApp();
  const [hostelName, setHostelName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState(3);
  const [cleanliness, setCleanliness] = useState(3);
  const [location, setLocation] = useState(3);
  const [value, setValue] = useState(3);
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Rating must be 1-5");
      return;
    }
    const review: HostelReview = { id: String(++clientId), hostelName, city, country, rating, cleanliness, location, value, date, comment };
    addReview(review);
    navigate("/reviews");
  }

  return (
    <div data-testid="add-review-page">
      <h2>Add Review</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input data-testid="input-hostel-name" value={hostelName} onChange={(e) => setHostelName(e.target.value)} placeholder="Hostel Name" />
        <input data-testid="input-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
        <input data-testid="input-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
        <input data-testid="input-rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        <input data-testid="input-cleanliness" type="number" min={1} max={5} value={cleanliness} onChange={(e) => setCleanliness(Number(e.target.value))} />
        <input data-testid="input-location" type="number" min={1} max={5} value={location} onChange={(e) => setLocation(Number(e.target.value))} />
        <input data-testid="input-value" type="number" min={1} max={5} value={value} onChange={(e) => setValue(Number(e.target.value))} />
        <input data-testid="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <textarea data-testid="input-comment" value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit" data-testid="submit-review">Save Review</button>
      </form>
    </div>
  );
}
