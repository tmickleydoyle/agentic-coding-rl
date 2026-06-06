import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function TripsPage() {
  const { trips } = useApp();
  return (
    <div data-testid="trips-page">
      <h2>All Trips</h2>
      {trips.map((t) => (
        <div key={t.id} data-testid="trip-card">
          <span data-testid="trip-name">{t.name}</span>
          <span data-testid="trip-destination">{t.destination}</span>
          <span data-testid="trip-status">{t.status}</span>
          <span data-testid="trip-dates">{t.startDate} to {t.endDate}</span>
        </div>
      ))}
    </div>
  );
}
