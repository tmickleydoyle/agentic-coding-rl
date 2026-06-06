import React from "react";
import { getRegistrations, getEvents } from "../../lib/store";

export function RegistrationsPage() {
  const registrations = getRegistrations();
  const events = getEvents();

  function getEventTitle(eventId: string): string {
    const ev = events.find((e) => e.id === eventId);
    return ev ? ev.title : eventId;
  }

  return (
    <div data-testid="registrations-page">
      <h2>Registrations</h2>
      {registrations.length === 0 ? (
        <p data-testid="empty-registrations">No registrations yet</p>
      ) : (
        registrations.map((r) => (
          <div key={r.id} data-testid={`reg-row-${r.id}`}>
            <span data-testid={`reg-event-${r.id}`}>{getEventTitle(r.eventId)}</span>
            <span data-testid={`reg-attendee-${r.id}`}>{r.attendee}</span>
            <span data-testid={`reg-email-${r.id}`}>{r.email}</span>
          </div>
        ))
      )}
    </div>
  );
}
