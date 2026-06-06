import React, { useState } from "react";
import { getEvents, addEvent, deleteEvent } from "../../lib/store";
import { NetworkEvent } from "../../lib/types";

export function EventsPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<NetworkEvent["type"]>("conference");
  const [, forceUpdate] = useState(0);

  const events = getEvents();

  const handleAdd = () => {
    if (!name.trim() || !date.trim() || !location.trim()) return;
    addEvent({ name: name.trim(), date, location: location.trim(), type });
    setName(""); setDate(""); setLocation("");
    forceUpdate((n) => n + 1);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="events-page">
      <h2>Events</h2>
      {events.map((e) => (
        <div key={e.id} data-testid="event-item">
          <span data-testid="event-name">{e.name}</span>
          <span data-testid="event-date">{e.date}</span>
          <span data-testid="event-type">{e.type}</span>
          <span data-testid="event-location">{e.location}</span>
          <button data-testid="delete-event" onClick={() => handleDelete(e.id)}>Delete</button>
        </div>
      ))}
      <div data-testid="add-event-form">
        <input data-testid="event-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="event-date-input" value={date} onChange={(e) => setDate(e.target.value)} type="date" />
        <input data-testid="event-location-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <select data-testid="event-type-select" value={type} onChange={(e) => setType(e.target.value as NetworkEvent["type"])}>
          <option value="conference">Conference</option>
          <option value="meetup">Meetup</option>
          <option value="workshop">Workshop</option>
          <option value="other">Other</option>
        </select>
        <button data-testid="add-event-btn" onClick={handleAdd}>Add Event</button>
      </div>
    </div>
  );
}
