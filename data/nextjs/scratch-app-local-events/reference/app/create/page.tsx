import React, { useState } from "react";
import { createEvent } from "../../lib/store";
import type { EventCategory } from "../../lib/types";

export function CreatePage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<EventCategory>("Community");
  const [organizer, setOrganizer] = useState("");
  const [capacity, setCapacity] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cap = parseInt(capacity, 10);
    if (!title.trim() || cap <= 0 || isNaN(cap)) return;
    createEvent(title.trim(), date, category, organizer.trim(), cap);
    setTitle(""); setDate(""); setCategory("Community"); setOrganizer(""); setCapacity("");
    setSuccess(true);
  }

  return (
    <div data-testid="create-page">
      <h2>Create Event</h2>
      {success && <p data-testid="create-success">Event created!</p>}
      <form data-testid="create-form" onSubmit={handleSubmit}>
        <input data-testid="create-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="create-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select data-testid="create-category" value={category} onChange={(e) => setCategory(e.target.value as EventCategory)}>
          <option value="Festival">Festival</option>
          <option value="Workshop">Workshop</option>
          <option value="Sport">Sport</option>
          <option value="Community">Community</option>
        </select>
        <input data-testid="create-organizer" placeholder="Organizer" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
        <input data-testid="create-capacity" type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        <button data-testid="create-submit" type="submit">Create</button>
      </form>
    </div>
  );
}
