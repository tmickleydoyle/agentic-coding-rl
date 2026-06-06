import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SchedulePage() {
  const { activities } = useApp();
  const days = Array.from(new Set(activities.map((a) => a.day))).sort((a, b) => a - b);

  return (
    <div data-testid="schedule-page">
      <h2>Schedule</h2>
      {days.map((day) => {
        const dayActivities = activities.filter((a) => a.day === day).sort((a, b) => a.time.localeCompare(b.time));
        return (
          <div key={day} data-testid="day-group">
            <h3 data-testid="day-label">Day {day}</h3>
            {dayActivities.map((a) => (
              <div key={a.id} data-testid="activity-card">
                <span data-testid="activity-title">{a.title}</span>
                <span data-testid="activity-time">{a.time}</span>
                <span data-testid="activity-location">{a.location}</span>
                <span data-testid="activity-category">{a.category}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
