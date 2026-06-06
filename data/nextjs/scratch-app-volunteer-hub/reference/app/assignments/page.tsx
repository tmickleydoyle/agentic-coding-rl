import React, { useState } from "react";
import { getVolunteers, getAssignments, addAssignment, markComplete } from "../../lib/store";

export function AssignmentsPage() {
  const [, setTick] = useState(0);
  const [title, setTitle] = useState("");
  const [volunteerId, setVolunteerId] = useState("");
  const [date, setDate] = useState("");

  const assignments = getAssignments();
  const activeVolunteers = getVolunteers().filter((v) => v.status === "Active");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !volunteerId || !date) return;
    addAssignment(volunteerId, title.trim(), date);
    setTitle("");
    setVolunteerId("");
    setDate("");
    setTick((t) => t + 1);
  }

  function handleComplete(id: string) {
    markComplete(id);
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="assignments-page">
      <h2>Assignments</h2>
      <form data-testid="assignment-form" onSubmit={handleSubmit}>
        <input data-testid="assignment-title" placeholder="Title" value={title}
          onChange={(e) => setTitle(e.target.value)} />
        <select data-testid="assignment-volunteer" value={volunteerId}
          onChange={(e) => setVolunteerId(e.target.value)}>
          <option value="">Select volunteer</option>
          {activeVolunteers.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        <input data-testid="assignment-date" type="date" value={date}
          onChange={(e) => setDate(e.target.value)} />
        <button data-testid="assignment-submit" type="submit">Add Assignment</button>
      </form>
      {assignments.length === 0 ? (
        <p data-testid="empty-assignments">No assignments yet</p>
      ) : (
        assignments.map((a) => (
          <div key={a.id} data-testid={`assignment-row-${a.id}`}>
            <span data-testid={`assignment-title-${a.id}`}>{a.title}</span>
            <span data-testid={`assignment-status-${a.id}`}>{a.status}</span>
            <span data-testid={`assignment-date-${a.id}`}>{a.date}</span>
            {a.status === "Pending" && (
              <button data-testid={`complete-${a.id}`} onClick={() => handleComplete(a.id)}>
                Mark Complete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
