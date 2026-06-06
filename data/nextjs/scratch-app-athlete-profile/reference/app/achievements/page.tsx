import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function AchievementsPage() {
  const { achievements, addAchievement, deleteAchievement } = useApp();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addAchievement(title, date, description);
    setTitle(""); setDate(""); setDescription("");
  }

  return (
    <div data-testid="achievements-page">
      <h1>Achievements</h1>
      <form data-testid="add-achievement-form" onSubmit={handleSubmit}>
        <input data-testid="input-achievement-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="input-achievement-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-achievement-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit" data-testid="btn-add-achievement">Add</button>
      </form>
      <ul data-testid="achievements-list">
        {achievements.map((a) => (
          <li key={a.id} data-testid={`achievement-item-${a.id}`}>
            <span data-testid={`achievement-title-${a.id}`}>{a.title}</span>
            <button data-testid={`btn-delete-achievement-${a.id}`} onClick={() => deleteAchievement(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
