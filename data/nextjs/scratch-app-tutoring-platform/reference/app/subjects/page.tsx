import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { getTutorsBySubject } from "../../lib/store";
import type { Subject } from "../../lib/types";

const SUBJECTS: Subject[] = ["Math", "Science", "English", "History", "Computer Science", "Music", "Art"];

export default function SubjectsPage() {
  const { tutors } = useApp();
  const [selected, setSelected] = useState<Subject>("Math");
  const filtered = getTutorsBySubject(selected);

  return (
    <div data-testid="subjects-page">
      <h2>Browse by Subject</h2>
      <div data-testid="subject-tabs">
        {SUBJECTS.map(s => (
          <button key={s} data-testid={`tab-${s.replace(" ", "-").toLowerCase()}`} onClick={() => setSelected(s)} aria-pressed={selected === s}>
            {s}
          </button>
        ))}
      </div>
      <div data-testid="subject-tutor-count">{filtered.length} tutors for {selected}</div>
      <ul data-testid="subject-tutor-list">
        {filtered.map(t => (
          <li key={t.id} data-testid={`subject-tutor-${t.id}`}>
            <span data-testid={`st-name-${t.id}`}>{t.name}</span>
            <span data-testid={`st-rate-${t.id}`}>${t.hourlyRate}/hr</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
