import React, { useState } from "react";
import { getEvents, getSpeakers, addEvent, toggleRsvp } from "../../lib/store";

export function EventsPage() {
  const [speakerId, setSpeakerId] = useState("");
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [, forceUpdate] = useState(0);

  const speakers = getSpeakers();
  const events = getEvents();
  const speakerMap = new Map<string, string>();
  speakers.forEach((s) => speakerMap.set(s.id, s.name));

  const handleAdd = () => {
    if (!speakerId || !eventName.trim() || !date || !location.trim()) return;
    addEvent({ speakerId, eventName: eventName.trim(), date, location: location.trim() });
    setEventName(""); setDate(""); setLocation("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="events-page">
      <h2>Speaking Events</h2>
      {events.map((e) => (
        <div key={e.id} data-testid="event-item">
          <span data-testid="event-name">{e.eventName}</span>
          <span data-testid="event-date">{e.date}</span>
          <span data-testid="event-location">{e.location}</span>
          <span data-testid="event-speaker">{speakerMap.get(e.speakerId) ?? ""}</span>
          {e.rsvped && <span data-testid="rsvped-badge">RSVP'd</span>}
          <button data-testid="rsvp-btn" onClick={() => { toggleRsvp(e.id); forceUpdate((n) => n + 1); }}>
            {e.rsvped ? "Cancel RSVP" : "RSVP"}
          </button>
        </div>
      ))}
      <div data-testid="add-event-form">
        <select data-testid="event-speaker-select" value={speakerId} onChange={(e) => setSpeakerId(e.target.value)}>
          <option value="">Select speaker</option>
          {speakers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input data-testid="event-name-input" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event name" />
        <input data-testid="event-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="event-location-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <button data-testid="add-event-btn" onClick={handleAdd}>Add Event</button>
      </div>
    </div>
  );
}
