import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { PackingList } from "../../lib/types";

let clientId = 100;

export default function AddListPage() {
  const { navigate, addList } = useApp();
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const list: PackingList = { id: String(++clientId), tripName, destination, departureDate, items: [] };
    addList(list);
    navigate("/lists");
  }

  return (
    <div data-testid="add-list-page">
      <h2>New Packing List</h2>
      <form onSubmit={handleSubmit}>
        <input data-testid="input-trip-name" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="Trip Name" />
        <input data-testid="input-destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
        <input data-testid="input-departure-date" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
        <button type="submit" data-testid="submit-list">Save List</button>
      </form>
    </div>
  );
}
