import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function CalendarPage() {
  const { trips } = useApp();
  const sorted = trips.slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
  return (
    <div data-testid="calendar-page">
      <h2>Calendar</h2>
      {sorted.map((t) => (
        <div key={t.id} data-testid="calendar-trip">
          <span data-testid="calendar-trip-name">{t.name}</span>
          <span data-testid="calendar-trip-range">{t.startDate} → {t.endDate}</span>
        </div>
      ))}
    </div>
  );
}
