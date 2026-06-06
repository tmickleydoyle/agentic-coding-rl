import React from "react";

export default function AchievementsPage() {
  return (
    <div data-testid="achievements-page">
      <h1>Achievements</h1>
      <form data-testid="add-achievement-form">
        <input data-testid="input-achievement-title" placeholder="Title" />
        <input data-testid="input-achievement-date" type="date" />
        <input data-testid="input-achievement-description" placeholder="Description" />
        <button type="submit" data-testid="btn-add-achievement">Add</button>
      </form>
      <ul data-testid="achievements-list"></ul>
    </div>
  );
}
