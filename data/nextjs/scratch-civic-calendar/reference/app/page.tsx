import React, { useState } from "react";

type Category = "Election" | "Registration" | "Debate";

interface CivicEvent {
  id: number;
  title: string;
  date: string;
  category: Category;
  description: string;
}

const SEED: CivicEvent[] = [
  { id: 1, title: "Voter Registration Deadline", date: "2026-10-05", category: "Registration", description: "Last day to register statewide" },
  { id: 2, title: "Primary Election Day", date: "2026-06-15", category: "Election", description: "Polls open 7am–8pm" },
  { id: 3, title: "Candidate Forum", date: "2026-07-20", category: "Debate", description: "Hosted by League of Women Voters" },
  { id: 4, title: "Absentee Ballot Deadline", date: "2026-10-28", category: "Registration", description: "Mail-in ballots must be postmarked" },
  { id: 5, title: "General Election Day", date: "2026-11-03", category: "Election", description: "Polls open 6am–9pm" },
];

export default function App() {
  const [events, setEvents] = useState<CivicEvent[]>(SEED.map((e) => ({ ...e })));
  const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");
  const [titleInput, setTitleInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<Category>("Election");
  const [descInput, setDescInput] = useState("");
  const [nextId, setNextId] = useState(6);

  const sorted = [...events].sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.id - b.id;
  });

  const visible = sorted.filter(
    (e) => activeFilter === "All" || e.category === activeFilter
  );

  function handleDelete(id: number) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function handleAdd() {
    if (!titleInput.trim() || !dateInput.trim()) return;
    const newEvent: CivicEvent = {
      id: nextId,
      title: titleInput.trim(),
      date: dateInput,
      category: categoryInput,
      description: descInput,
    };
    setEvents((prev) => [...prev, newEvent]);
    setNextId((n) => n + 1);
    setTitleInput("");
    setDateInput("");
    setCategoryInput("Election");
    setDescInput("");
  }

  const filterLabels: Array<"All" | Category> = ["All", "Election", "Registration", "Debate"];

  return (
    <div>
      <h1>Civic Calendar</h1>

      <div>
        {filterLabels.map((label) => (
          <button
            key={label}
            data-testid={`filter-${label.toLowerCase()}`}
            aria-pressed={activeFilter === label}
            onClick={() => setActiveFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        {visible.map((e) => (
          <div key={e.id} data-testid="event-card">
            <span data-testid="event-title">{e.title}</span>
            <span data-testid="event-date">{e.date}</span>
            <span data-testid="event-category">{e.category}</span>
            <span data-testid="event-description">{e.description}</span>
            <button data-testid="delete-event-btn" onClick={() => handleDelete(e.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          data-testid="title-input"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Event title"
        />
        <input
          type="date"
          data-testid="date-input"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <select
          data-testid="category-select"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value as Category)}
        >
          <option value="Election">Election</option>
          <option value="Registration">Registration</option>
          <option value="Debate">Debate</option>
        </select>
        <textarea
          data-testid="description-textarea"
          value={descInput}
          onChange={(e) => setDescInput(e.target.value)}
          placeholder="Description (optional)"
        />
        <button data-testid="add-event-btn" onClick={handleAdd}>
          Add Event
        </button>
      </div>
    </div>
  );
}
