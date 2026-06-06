import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulePage() {
  const { workouts } = useApp();
  const [schedule, setSchedule] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(DAYS.map((d) => [d, []]))
  );

  function assign(day: string, workoutId: string) {
    setSchedule((prev) => {
      const existing = prev[day] || [];
      if (existing.includes(workoutId)) return prev;
      return { ...prev, [day]: [...existing, workoutId] };
    });
  }

  return (
    <div data-testid="schedule-page">
      <h1>Weekly Schedule</h1>
      {DAYS.map((day) => (
        <div key={day} data-testid={`schedule-day-${day}`}>
          <strong>{day}</strong>
          <select
            data-testid={`select-workout-${day}`}
            defaultValue=""
            onChange={(e) => { if (e.target.value) assign(day, e.target.value); }}
          >
            <option value="">-- assign --</option>
            {workouts.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <ul>
            {(schedule[day] || []).map((wid) => {
              const w = workouts.find((x) => x.id === wid);
              return w ? <li key={wid} data-testid={`scheduled-${day}-${wid}`}>{w.name}</li> : null;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
