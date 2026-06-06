import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { Activity, ActivityCategory } from "../../lib/types";

let clientId = 100;

export default function AddActivityPage() {
  const { navigate, addActivity } = useApp();
  const [day, setDay] = useState(1);
  const [time, setTime] = useState("09:00");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("Sightseeing");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState(0);

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const activity: Activity = { id: String(++clientId), day, time, title, location, category, duration, notes, cost };
    addActivity(activity);
    navigate("/schedule");
  }

  return (
    <div data-testid="add-activity-page">
      <h2>Add Activity</h2>
      <form onSubmit={handleSubmit}>
        <input data-testid="input-day" type="number" value={day} onChange={(e) => setDay(Number(e.target.value))} />
        <input data-testid="input-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="input-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <select data-testid="input-category" value={category} onChange={(e) => setCategory(e.target.value as ActivityCategory)}>
          <option value="Food">Food</option>
          <option value="Sightseeing">Sightseeing</option>
          <option value="Transport">Transport</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <input data-testid="input-duration" type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        <textarea data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <input data-testid="input-cost" type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
        <button type="submit" data-testid="submit-activity">Save Activity</button>
      </form>
    </div>
  );
}
