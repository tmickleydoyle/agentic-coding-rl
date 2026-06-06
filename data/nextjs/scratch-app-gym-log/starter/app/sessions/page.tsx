import React from "react";

export default function SessionsPage() {
  return (
    <div data-testid="sessions-page">
      <h1>Gym Sessions</h1>
      <form data-testid="add-session-form">
        <input data-testid="input-session-name" placeholder="Session name" />
        <input data-testid="input-session-date" type="date" />
        <button type="submit" data-testid="btn-add-session">Add</button>
      </form>
      <ul data-testid="session-list"></ul>
    </div>
  );
}
