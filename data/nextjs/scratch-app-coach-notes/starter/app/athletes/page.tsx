import React from "react";

export default function AthletesPage() {
  return (
    <div data-testid="athletes-page">
      <h1>Athletes</h1>
      <form data-testid="add-athlete-form">
        <input data-testid="input-athlete-name" placeholder="Name" />
        <input data-testid="input-athlete-sport" placeholder="Sport" />
        <select data-testid="input-athlete-level">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button type="submit" data-testid="btn-add-athlete">Add</button>
      </form>
      <ul data-testid="athlete-list"></ul>
    </div>
  );
}
