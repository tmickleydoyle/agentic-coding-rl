import React from "react";

export default function EventsPage() {
  return (
    <div data-testid="events-page">
      <h1>Events</h1>
      <form data-testid="add-event-form">
        <input data-testid="input-event-name" placeholder="Event name" />
        <input data-testid="input-event-date" type="date" />
        <input data-testid="input-event-result" placeholder="Result" />
        <input data-testid="input-event-place" type="number" placeholder="Place" />
        <button type="submit" data-testid="btn-add-event">Add</button>
      </form>
      <ul data-testid="events-list"></ul>
    </div>
  );
}
