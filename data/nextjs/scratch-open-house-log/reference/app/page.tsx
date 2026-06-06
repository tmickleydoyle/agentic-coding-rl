import React, { useState } from "react";

interface Visit {
  id: number;
  address: string;
  date: string;
  agent: string;
  rating: number;
  notes: string;
}

const SEED_VISITS: Visit[] = [
  { id: 1, address: "123 Maple St", date: "2024-03-02", agent: "Sarah Johnson", rating: 4, notes: "Great natural light, small backyard" },
  { id: 2, address: "456 Oak Ave", date: "2024-03-09", agent: "Mike Chen", rating: 3, notes: "Nice kitchen but noisy street" },
  { id: 3, address: "789 Pine Rd", date: "2024-03-16", agent: "Lisa Park", rating: 5, notes: "Perfect layout, large yard, quiet neighborhood" },
];

function starsDisplay(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

let nextId = 4;

export default function App() {
  const [visits, setVisits] = useState<Visit[]>(SEED_VISITS);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [agent, setAgent] = useState("");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [sort, setSort] = useState("Date (Newest)");

  function handleAdd() {
    const ratingNum = parseInt(rating, 10);
    if (!address || !date || !agent || !rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      setError("Please fill in all required fields");
      return;
    }
    setError("");
    const newVisit: Visit = {
      id: nextId++,
      address,
      date,
      agent,
      rating: ratingNum,
      notes,
    };
    setVisits([...visits, newVisit]);
    setAddress("");
    setDate("");
    setAgent("");
    setRating("");
    setNotes("");
  }

  function handleDelete(id: number) {
    setVisits(visits.filter((v) => v.id !== id));
  }

  const sorted = [...visits].sort((a, b) => {
    if (sort === "Date (Newest)") return b.date.localeCompare(a.date);
    if (sort === "Date (Oldest)") return a.date.localeCompare(b.date);
    if (sort === "Rating (High)") return b.rating - a.rating;
    if (sort === "Rating (Low)") return a.rating - b.rating;
    return 0;
  });

  return (
    <div>
      <h1>Open House Log</h1>

      <div>
        <h2>Add Visit</h2>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="agent">Agent Name</label>
          <input id="agent" type="text" value={agent} onChange={(e) => setAgent(e.target.value)} />
        </div>
        <div>
          <label htmlFor="rating">Rating (1-5)</label>
          <input id="rating" type="number" value={rating} onChange={(e) => setRating(e.target.value)} min={1} max={5} />
        </div>
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {error && <div data-testid="form-error">{error}</div>}
        <button onClick={handleAdd}>Add Visit</button>
      </div>

      <div>
        <label htmlFor="sort-select">Sort by</label>
        <select
          id="sort-select"
          data-testid="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option>Date (Newest)</option>
          <option>Date (Oldest)</option>
          <option>Rating (High)</option>
          <option>Rating (Low)</option>
        </select>
      </div>

      {sorted.length === 0 && (
        <div data-testid="empty-state">No visits logged yet</div>
      )}

      {sorted.map((v) => (
        <div key={v.id} data-testid="visit-card">
          <h3>{v.address}</h3>
          <p>{v.date}</p>
          <p>{v.agent}</p>
          <p data-testid={`visit-rating-${v.id}`}>{starsDisplay(v.rating)}</p>
          {v.notes && <p>{v.notes}</p>}
          <button data-testid={`delete-visit-${v.id}`} onClick={() => handleDelete(v.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
