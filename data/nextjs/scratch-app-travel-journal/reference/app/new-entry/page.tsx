import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { JournalEntry, Mood } from "../../lib/types";

let clientId = 100;

export default function NewEntryPage() {
  const { navigate, addEntry } = useApp();
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [mood, setMood] = useState<Mood>("happy");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(3);
  const [error, setError] = useState("");

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!title || !country || !city || !date || !body) {
      setError("All fields are required");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Rating must be 1-5");
      return;
    }
    const entry: JournalEntry = {
      id: String(++clientId),
      title, country, city, date, mood, body, rating,
    };
    addEntry(entry);
    navigate("/journal");
  }

  return (
    <div data-testid="new-entry-page">
      <h2>New Journal Entry</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="input-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
        <input data-testid="input-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
        <input data-testid="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select data-testid="input-mood" value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
          <option value="happy">happy</option>
          <option value="neutral">neutral</option>
          <option value="sad">sad</option>
        </select>
        <textarea data-testid="input-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input data-testid="input-rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        <button type="submit" data-testid="submit-entry">Save Entry</button>
      </form>
    </div>
  );
}
