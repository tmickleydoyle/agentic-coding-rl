import React, { useState } from "react";

type Category = "Career" | "Academic" | "Social" | "Sports" | "Health";

interface CampusEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  category: Category;
  rsvpCount: number;
  rsvped: boolean;
}

const SEED: CampusEvent[] = [
  { id: 1, title: "Spring Career Fair", date: "2024-02-15", location: "Student Union", category: "Career", rsvpCount: 120, rsvped: false },
  { id: 2, title: "Hackathon 2024", date: "2024-03-01", location: "Engineering Hall", category: "Academic", rsvpCount: 85, rsvped: false },
  { id: 3, title: "Culture Night", date: "2024-02-20", location: "Auditorium", category: "Social", rsvpCount: 200, rsvped: false },
  { id: 4, title: "Study Skills Workshop", date: "2024-02-10", location: "Library", category: "Academic", rsvpCount: 30, rsvped: false },
];

const CATEGORIES: Category[] = ["Career", "Academic", "Social", "Sports", "Health"];

export default function App() {
  const [events, setEvents] = useState<CampusEvent[]>(SEED);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<Category>("Career");
  const [rsvpCount, setRsvpCount] = useState("0");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Category | "All">("All");
  const [nextId, setNextId] = useState(5);

  const handleAdd = () => {
    if (!title.trim() || !location.trim()) {
      setError("Title and location are required.");
      return;
    }
    setError("");
    setEvents((prev) => [
      ...prev,
      { id: nextId, title: title.trim(), date, location: location.trim(), category, rsvpCount: Number(rsvpCount) || 0, rsvped: false },
    ]);
    setNextId((n) => n + 1);
    setTitle("");
    setDate("");
    setLocation("");
    setCategory("Career");
    setRsvpCount("0");
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleRsvp = (id: number) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, rsvped: !e.rsvped, rsvpCount: e.rsvped ? e.rsvpCount - 1 : e.rsvpCount + 1 }
          : e
      )
    );
  };

  const visible = filter === "All" ? events : events.filter((e) => e.category === filter);

  const countTotal = events.length;
  const countRsvped = events.filter((e) => e.rsvped).length;

  return (
    <div>
      <h1>Campus Events</h1>

      <div>
        <span data-testid="count-total">Total: {countTotal}</span>
        {" | "}
        <span data-testid="count-rsvped">My RSVPs: {countRsvped}</span>
      </div>

      <div>
        <button data-testid="filter-all" aria-pressed={filter === "All"} onClick={() => setFilter("All")}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} data-testid={`filter-${c}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div>
        <label>
          Title
          <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Date
          <input type="date" data-testid="input-date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Location
          <input data-testid="input-location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label>
          Category
          <select data-testid="select-category" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          RSVP Count
          <input type="number" data-testid="input-rsvp-count" value={rsvpCount} onChange={(e) => setRsvpCount(e.target.value)} />
        </label>
        <button data-testid="btn-add" onClick={handleAdd}>Add Event</button>
        {error && <div data-testid="error-message">{error}</div>}
      </div>

      <div>
        {visible.map((e) => (
          <div key={e.id} data-testid="event-item">
            <span data-testid="event-title">{e.title}</span>
            <span data-testid="event-date">{e.date}</span>
            <span data-testid="event-location">{e.location}</span>
            <span data-testid="event-category">{e.category}</span>
            <span data-testid="event-rsvp-count">{e.rsvpCount}</span>
            <button data-testid="btn-rsvp" onClick={() => handleRsvp(e.id)}>
              {e.rsvped ? "Cancel RSVP" : "RSVP"}
            </button>
            <button data-testid="btn-delete" onClick={() => handleDelete(e.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
