import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function TutorsPage() {
  const { tutors } = useApp();
  const [filterAvailable, setFilterAvailable] = useState(false);
  const displayed = filterAvailable ? tutors.filter(t => t.available) : tutors;

  return (
    <div data-testid="tutors-page">
      <h2>Find a Tutor</h2>
      <label>
        <input data-testid="filter-available" type="checkbox" checked={filterAvailable} onChange={e => setFilterAvailable(e.target.checked)} />
        Available only
      </label>
      <ul data-testid="tutor-list">
        {displayed.map(t => (
          <li key={t.id} data-testid={`tutor-item-${t.id}`}>
            <span data-testid={`tutor-name-${t.id}`}>{t.name}</span>
            <span data-testid={`tutor-rate-${t.id}`}>${t.hourlyRate}/hr</span>
            <span data-testid={`tutor-rating-${t.id}`}>{t.rating}</span>
            <span data-testid={`tutor-subjects-${t.id}`}>{t.subjects.join(", ")}</span>
            {t.available && <span data-testid={`tutor-available-${t.id}`}>Available</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
