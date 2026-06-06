import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function EventsPage() {
  const { events, addEvent, deleteEvent } = useApp();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState("");
  const [place, setPlace] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addEvent(name, date, result, Number(place));
    setName(""); setDate(""); setResult(""); setPlace("");
  }

  return (
    <div data-testid="events-page">
      <h1>Events</h1>
      <form data-testid="add-event-form" onSubmit={handleSubmit}>
        <input data-testid="input-event-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Event name" />
        <input data-testid="input-event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-event-result" value={result} onChange={(e) => setResult(e.target.value)} placeholder="Result" />
        <input data-testid="input-event-place" type="number" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Place" />
        <button type="submit" data-testid="btn-add-event">Add</button>
      </form>
      <ul data-testid="events-list">
        {events.map((ev) => (
          <li key={ev.id} data-testid={`event-item-${ev.id}`}>
            <span data-testid={`event-name-${ev.id}`}>{ev.name}</span>
            <span data-testid={`event-place-${ev.id}`}>{ev.place}</span>
            {ev.place <= 3 && <span data-testid={`event-podium-${ev.id}`}>Podium</span>}
            <button data-testid={`btn-delete-event-${ev.id}`} onClick={() => deleteEvent(ev.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
