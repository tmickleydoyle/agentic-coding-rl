import React, { useState } from "react";
import { getEvents, registerForEvent } from "../../lib/store";

export function CalendarPage() {
  const [, setTick] = useState(0);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [attendee, setAttendee] = useState("");
  const [email, setEmail] = useState("");

  const events = getEvents();

  function handleRegister(eventId: string) {
    if (!attendee.trim() || !email.trim()) return;
    registerForEvent(eventId, attendee.trim(), email.trim());
    setAttendee(""); setEmail(""); setRegisteringId(null);
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="calendar-page">
      <h2>Events Calendar</h2>
      {events.map((ev) => (
        <div key={ev.id} data-testid={`event-row-${ev.id}`}>
          <span data-testid={`event-title-${ev.id}`}>{ev.title}</span>
          <span data-testid={`event-date-${ev.id}`}>{ev.date}</span>
          <span data-testid={`event-category-${ev.id}`}>{ev.category}</span>
          <span data-testid={`event-registered-${ev.id}`}>{ev.registered}</span>
          <span data-testid={`event-capacity-${ev.id}`}>{ev.capacity}</span>
          <button
            data-testid={`register-btn-${ev.id}`}
            disabled={ev.registered >= ev.capacity}
            onClick={() => setRegisteringId(ev.id)}
          >
            Register
          </button>
          {registeringId === ev.id && (
            <div data-testid={`register-form-${ev.id}`}>
              <input data-testid="register-attendee" placeholder="Name" value={attendee} onChange={(e) => setAttendee(e.target.value)} />
              <input data-testid="register-email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button data-testid="register-submit" onClick={() => handleRegister(ev.id)}>Confirm</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
