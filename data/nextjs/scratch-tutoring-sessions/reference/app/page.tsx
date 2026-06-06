import React, { useState } from "react";

type Subject = "Math" | "Science" | "English" | "History";

interface Session {
  id: number;
  student: string;
  subject: Subject;
  date: string;
  duration: number;
  notes: string;
  completed: boolean;
}

const SEED_SESSIONS: Session[] = [
  { id: 1, student: "Alice Johnson", subject: "Math", date: "2024-01-15", duration: 60, notes: "Covered quadratic equations", completed: true },
  { id: 2, student: "Bob Smith", subject: "Science", date: "2024-01-16", duration: 45, notes: "Discussed photosynthesis", completed: false },
  { id: 3, student: "Carol White", subject: "Math", date: "2024-01-17", duration: 90, notes: "Practiced geometry proofs", completed: false },
  { id: 4, student: "David Brown", subject: "English", date: "2024-01-18", duration: 60, notes: "Essay writing techniques", completed: true },
];

const SUBJECTS: Subject[] = ["Math", "Science", "English", "History"];

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [filterSubject, setFilterSubject] = useState<string>("All");
  const [student, setStudent] = useState("");
  const [subject, setSubject] = useState<Subject>("Math");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [notes, setNotes] = useState("");

  const filtered = sessions.filter(
    (s) => filterSubject === "All" || s.subject === filterSubject
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!student.trim() || !date.trim()) return;
    const newId = sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) + 1 : 1;
    setSessions([
      ...sessions,
      { id: newId, student, subject, date, duration, notes, completed: false },
    ]);
    setStudent("");
    setSubject("Math");
    setDate("");
    setDuration(60);
    setNotes("");
  }

  function handleComplete(id: number) {
    setSessions(sessions.map((s) => (s.id === id ? { ...s, completed: true } : s)));
  }

  function handleDelete(id: number) {
    setSessions(sessions.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1 data-testid="app-title">Tutoring Sessions</h1>

      <form data-testid="add-form" onSubmit={handleAdd}>
        <input
          data-testid="input-student"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
          placeholder="Student name"
        />
        <select
          data-testid="select-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as Subject)}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          data-testid="input-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          data-testid="input-duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <textarea
          data-testid="input-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
        />
        <button data-testid="btn-add" type="submit">Add Session</button>
      </form>

      <select
        data-testid="filter-subject"
        value={filterSubject}
        onChange={(e) => setFilterSubject(e.target.value)}
      >
        <option value="All">All</option>
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div data-testid="session-count">{filtered.length} sessions</div>

      <div data-testid="session-list">
        {filtered.map((s) => (
          <div key={s.id} data-testid={`session-item-${s.id}`}>
            <span data-testid={`session-student-${s.id}`}>{s.student}</span>
            <span data-testid={`session-subject-${s.id}`}>{s.subject}</span>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.duration} min</span>
            <button
              data-testid={`btn-complete-${s.id}`}
              onClick={() => handleComplete(s.id)}
            >
              {s.completed ? "Completed" : "Mark Complete"}
            </button>
            <button
              data-testid={`btn-delete-${s.id}`}
              onClick={() => handleDelete(s.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
