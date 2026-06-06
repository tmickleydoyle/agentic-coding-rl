import React, { useState } from "react";
import { getVolunteers, toggleVolunteerStatus } from "../../lib/store";

export function VolunteersPage() {
  const [, setTick] = useState(0);
  const volunteers = getVolunteers();

  function handleToggle(id: string) {
    toggleVolunteerStatus(id);
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="volunteers-page">
      <h2>Volunteers</h2>
      {volunteers.map((v) => (
        <div key={v.id} data-testid={`volunteer-row-${v.id}`}>
          <span data-testid={`volunteer-name-${v.id}`}>{v.name}</span>
          <span data-testid={`volunteer-status-${v.id}`}>{v.status}</span>
          <span data-testid={`volunteer-skills-${v.id}`}>{v.skills.join(", ")}</span>
          <button data-testid={`toggle-status-${v.id}`} onClick={() => handleToggle(v.id)}>
            Toggle Status
          </button>
        </div>
      ))}
    </div>
  );
}
