import React, { useState } from "react";
import { getEvents, rsvpEvent } from "../../lib/store";

export function EventsPage() {
  const [, setTick] = useState(0);
  const events = getEvents();

  function handleRsvp(id: string) {
    rsvpEvent(id);
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="events-page">
      <h2>Events</h2>
      {events.map((e) => (
        <div key={e.id} data-testid={`event-row-${e.id}`}>
          <span data-testid={`event-title-${e.id}`}>{e.title}</span>
          <span data-testid={`event-date-${e.id}`}>{e.date}</span>
          <span data-testid={`event-location-${e.id}`}>{e.location}</span>
          <span data-testid={`event-attendees-${e.id}`}>{e.attendees}</span>
          <button data-testid={`rsvp-${e.id}`} onClick={() => handleRsvp(e.id)}>RSVP</button>
        </div>
      ))}
    </div>
  );
}
