import React from "react";

export default function AddActivityPage() {
  return (
    <div data-testid="add-activity-page">
      <input data-testid="input-day" type="number" />
      <input data-testid="input-time" type="time" />
      <input data-testid="input-title" />
      <input data-testid="input-location" />
      <select data-testid="input-category"><option value="Sightseeing">Sightseeing</option></select>
      <input data-testid="input-duration" type="number" />
      <textarea data-testid="input-notes" />
      <input data-testid="input-cost" type="number" />
      <button data-testid="submit-activity">Save Activity</button>
    </div>
  );
}
