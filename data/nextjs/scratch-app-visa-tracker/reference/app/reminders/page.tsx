import React from "react";
import { useApp } from "../../components/AppStateProvider";

const TODAY = "2024-06-01";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default function RemindersPage() {
  const { visas } = useApp();
  const todayMs = new Date(TODAY).getTime();
  const cutoffMs = todayMs + THIRTY_DAYS_MS;

  const upcoming = visas.filter((v) => {
    if (v.status !== "approved") return false;
    const expMs = new Date(v.expiryDate).getTime();
    return expMs >= todayMs && expMs <= cutoffMs;
  });

  return (
    <div data-testid="reminders-page">
      <h2>Expiring Soon</h2>
      {upcoming.map((v) => {
        const days = Math.round((new Date(v.expiryDate).getTime() - todayMs) / (24 * 60 * 60 * 1000));
        return (
          <div key={v.id} data-testid="reminder-card">
            <span data-testid="reminder-country">{v.country}</span>
            <span data-testid="reminder-days">{days}</span>
          </div>
        );
      })}
      {upcoming.length === 0 && <p data-testid="no-reminders">No upcoming expirations</p>}
    </div>
  );
}
