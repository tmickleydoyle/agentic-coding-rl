import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { Trip, TripStatus } from "../../lib/types";

let clientId = 100;

export default function NewTripPage() {
  const { navigate, addTrip } = useApp();
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<TripStatus>("planned");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (endDate < startDate) {
      setError("End date must be after start date");
      return;
    }
    const trip: Trip = { id: String(++clientId), name, destination, startDate, endDate, status, notes };
    addTrip(trip);
    navigate("/trips");
  }

  return (
    <div data-testid="new-trip-page">
      <h2>New Trip</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="input-destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
        <input data-testid="input-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input data-testid="input-end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <select data-testid="input-status" value={status} onChange={(e) => setStatus(e.target.value as TripStatus)}>
          <option value="planned">planned</option>
          <option value="active">active</option>
          <option value="done">done</option>
        </select>
        <textarea data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit" data-testid="submit-trip">Save Trip</button>
      </form>
    </div>
  );
}
