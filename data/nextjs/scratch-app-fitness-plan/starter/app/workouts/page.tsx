import React from "react";

export default function WorkoutsPage() {
  return (
    <div data-testid="workouts-page">
      <h1>Workouts</h1>
      <form data-testid="add-workout-form">
        <input data-testid="input-name" placeholder="Name" />
        <select data-testid="input-type">
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
        </select>
        <input data-testid="input-duration" type="number" placeholder="Duration (min)" />
        <button type="submit" data-testid="btn-add-workout">Add</button>
      </form>
      <ul data-testid="workout-list"></ul>
    </div>
  );
}
