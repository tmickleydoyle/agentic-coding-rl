import React from "react";
export function MeetingsPage() {
  return (
    <div data-testid="meetings-page">
      <h1>Meeting Notes</h1>
      <div data-testid="meeting-form">
        <input data-testid="input-title" placeholder="Title" />
        <input data-testid="input-date" type="date" />
        <input data-testid="input-attendees" placeholder="Attendees" />
        <textarea data-testid="input-notes" placeholder="Notes" />
        <textarea data-testid="input-action-items" placeholder="Action items" />
        <button data-testid="btn-submit">Add Meeting</button>
      </div>
      <ul data-testid="meetings-list"></ul>
    </div>
  );
}
