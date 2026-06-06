import React, { useState } from "react";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  capacity: number;
}

interface Signup {
  id: number;
  eventId: number;
  volunteerName: string;
  email: string;
}

const SEED_EVENTS: Event[] = [
  { id: 1, name: "Park Cleanup Day", date: "2024-04-06", location: "Central Park", capacity: 20 },
  { id: 2, name: "Food Bank Volunteer", date: "2024-04-13", location: "Community Center", capacity: 15 },
  { id: 3, name: "Beach Cleanup", date: "2024-04-20", location: "Sunset Beach", capacity: 30 },
];

const SEED_SIGNUPS: Signup[] = [
  { id: 1, eventId: 1, volunteerName: "Alice Johnson", email: "alice@example.com" },
  { id: 2, eventId: 1, volunteerName: "Bob Smith", email: "bob@example.com" },
  { id: 3, eventId: 2, volunteerName: "Carol Davis", email: "carol@example.com" },
];

let nextEventId = 4;
let nextSignupId = 4;

export default function App() {
  const [events, setEvents] = useState<Event[]>(SEED_EVENTS);
  const [signups, setSignups] = useState<Signup[]>(SEED_SIGNUPS);

  const [eventNameInput, setEventNameInput] = useState("");
  const [eventDateInput, setEventDateInput] = useState("");
  const [eventLocationInput, setEventLocationInput] = useState("");
  const [eventCapacityInput, setEventCapacityInput] = useState("");

  const [signupEventId, setSignupEventId] = useState("");
  const [signupNameInput, setSignupNameInput] = useState("");
  const [signupEmailInput, setSignupEmailInput] = useState("");

  const getFilledCount = (eventId: number) =>
    signups.filter((s) => s.eventId === eventId).length;

  const availableEvents = events.filter((e) => getFilledCount(e.id) < e.capacity);

  const handleAddEvent = () => {
    const capacity = parseInt(eventCapacityInput);
    if (!eventNameInput.trim() || !eventDateInput || !eventLocationInput.trim() || !eventCapacityInput || capacity < 1) {
      return;
    }
    const newEvent: Event = {
      id: nextEventId++,
      name: eventNameInput.trim(),
      date: eventDateInput,
      location: eventLocationInput.trim(),
      capacity,
    };
    setEvents([...events, newEvent]);
    setEventNameInput("");
    setEventDateInput("");
    setEventLocationInput("");
    setEventCapacityInput("");
  };

  const handleSignup = () => {
    if (!signupEventId || !signupNameInput.trim() || !signupEmailInput.includes("@")) return;
    const eventId = parseInt(signupEventId);
    const event = events.find((e) => e.id === eventId);
    if (!event) return;
    if (getFilledCount(eventId) >= event.capacity) return;
    const alreadySignedUp = signups.some(
      (s) => s.eventId === eventId && s.email.toLowerCase() === signupEmailInput.toLowerCase()
    );
    if (alreadySignedUp) return;
    const newSignup: Signup = {
      id: nextSignupId++,
      eventId,
      volunteerName: signupNameInput.trim(),
      email: signupEmailInput.trim(),
    };
    setSignups([...signups, newSignup]);
    setSignupEventId("");
    setSignupNameInput("");
    setSignupEmailInput("");
  };

  const handleCancelEvent = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    setSignups(signups.filter((s) => s.eventId !== id));
  };

  const totalEvents = events.length;
  const totalSignups = signups.length;
  const availableSpots = events.reduce((sum, e) => sum + (e.capacity - getFilledCount(e.id)), 0);

  return (
    <div>
      <h1>Event Signup</h1>

      <section>
        <h2>Add Event</h2>
        <label htmlFor="event-name">Event Name</label>
        <input
          id="event-name"
          type="text"
          value={eventNameInput}
          onChange={(e) => setEventNameInput(e.target.value)}
          data-testid="input-event-name"
        />
        <label htmlFor="event-date">Date</label>
        <input
          id="event-date"
          type="date"
          value={eventDateInput}
          onChange={(e) => setEventDateInput(e.target.value)}
          data-testid="input-event-date"
        />
        <label htmlFor="event-location">Location</label>
        <input
          id="event-location"
          type="text"
          value={eventLocationInput}
          onChange={(e) => setEventLocationInput(e.target.value)}
          data-testid="input-event-location"
        />
        <label htmlFor="event-capacity">Capacity</label>
        <input
          id="event-capacity"
          type="number"
          min="1"
          step="1"
          value={eventCapacityInput}
          onChange={(e) => setEventCapacityInput(e.target.value)}
          data-testid="input-event-capacity"
        />
        <button onClick={handleAddEvent} data-testid="btn-add-event">
          Add Event
        </button>
      </section>

      <section>
        <h2>Sign Up</h2>
        <label htmlFor="signup-event">Select Event</label>
        <select
          id="signup-event"
          value={signupEventId}
          onChange={(e) => setSignupEventId(e.target.value)}
          data-testid="select-event"
        >
          <option value="">-- Select an event --</option>
          {availableEvents.map((e) => (
            <option key={e.id} value={String(e.id)}>
              {e.name}
            </option>
          ))}
        </select>
        <label htmlFor="signup-name">Volunteer Name</label>
        <input
          id="signup-name"
          type="text"
          value={signupNameInput}
          onChange={(e) => setSignupNameInput(e.target.value)}
          data-testid="input-signup-name"
        />
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={signupEmailInput}
          onChange={(e) => setSignupEmailInput(e.target.value)}
          data-testid="input-signup-email"
        />
        <button onClick={handleSignup} data-testid="btn-signup">
          Sign Up
        </button>
      </section>

      <section>
        <h2>Events</h2>
        {events.length === 0 ? (
          <p data-testid="no-events">No events scheduled.</p>
        ) : (
          <ul data-testid="events-list">
            {events.map((event) => {
              const filled = getFilledCount(event.id);
              const isFull = filled >= event.capacity;
              const eventSignups = signups.filter((s) => s.eventId === event.id);
              return (
                <li key={event.id} data-testid={`event-${event.id}`}>
                  <span data-testid={`event-name-${event.id}`}>{event.name}</span>
                  {" — "}
                  <span data-testid={`event-date-${event.id}`}>{event.date}</span>
                  {" — "}
                  <span data-testid={`event-location-${event.id}`}>{event.location}</span>
                  {" — Spots: "}
                  <span data-testid={`event-spots-${event.id}`}>
                    {filled} / {event.capacity}
                  </span>
                  {isFull && (
                    <span data-testid={`full-badge-${event.id}`}> Full</span>
                  )}
                  {eventSignups.length > 0 && (
                    <ul data-testid={`signups-list-${event.id}`}>
                      {eventSignups.map((s) => (
                        <li key={s.id} data-testid={`signup-${s.id}`}>
                          {s.volunteerName} — {s.email}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => handleCancelEvent(event.id)}
                    data-testid={`btn-cancel-${event.id}`}
                  >
                    Cancel Event
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2>Summary</h2>
        <p data-testid="total-events">Total Events: {totalEvents}</p>
        <p data-testid="total-signups">Total Signups: {totalSignups}</p>
        <p data-testid="available-spots">Available Spots: {availableSpots}</p>
      </section>
    </div>
  );
}
