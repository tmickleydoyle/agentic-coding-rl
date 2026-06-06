import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function CalendarPage() {
  const { bills } = useApp();
  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div data-testid="calendar-page">
      <h1>Bill Calendar</h1>
      <ul data-testid="calendar-list">
        {days.map((day) => {
          const dayBills = bills.filter((b) => b.dueDay === day && b.isActive);
          if (dayBills.length === 0) return null;
          return (
            <li key={day} data-testid={`calendar-day-${day}`}>
              <span data-testid={`day-label-${day}`}>Day {day}</span>
              <ul>
                {dayBills.map((b) => (
                  <li key={b.id} data-testid={`cal-bill-${b.id}`}>{b.name}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
