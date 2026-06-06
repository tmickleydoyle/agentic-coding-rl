import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addAssignment, updateAssignmentStatus, deleteAssignment } from "../../lib/store";
import type { Priority, AssignmentStatus } from "../../lib/types";

const PRIORITIES: Priority[] = ["low", "medium", "high"];

export default function AssignmentsPage() {
  const { assignments, setAssignments } = useApp();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [description, setDescription] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("30");
  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | "">("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!title.trim() || !subject.trim() || !dueDate) { setError("Title, subject, and due date required"); return; }
    const mins = parseInt(estimatedMinutes, 10);
    if (isNaN(mins) || mins < 0) { setError("Estimated minutes must be non-negative"); return; }
    const a = addAssignment({ title: title.trim(), subject: subject.trim(), dueDate, priority, status: "todo", description, estimatedMinutes: mins });
    setAssignments([...assignments, a]);
    setTitle(""); setSubject(""); setDueDate(""); setDescription(""); setError("");
  }

  function handleStatus(id: string, status: AssignmentStatus) {
    const updated = updateAssignmentStatus(id, status);
    if (updated) setAssignments(assignments.map(a => a.id === id ? updated : a));
  }

  function handleDelete(id: string) {
    deleteAssignment(id);
    setAssignments(assignments.filter(a => a.id !== id));
  }

  const displayed = filterStatus ? assignments.filter(a => a.status === filterStatus) : assignments;
  const sorted = [...displayed].sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });

  return (
    <div data-testid="assignments-page">
      <h2>Assignments</h2>
      {error && <div data-testid="assignment-error">{error}</div>}
      <select data-testid="filter-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value as AssignmentStatus | "")}>
        <option value="">All</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <ul data-testid="assignment-list">
        {sorted.map(a => (
          <li key={a.id} data-testid={`assignment-item-${a.id}`}>
            <span data-testid={`assignment-title-${a.id}`}>{a.title}</span>
            <span data-testid={`assignment-subject-${a.id}`}>{a.subject}</span>
            <span data-testid={`assignment-status-${a.id}`}>{a.status}</span>
            <span data-testid={`assignment-priority-${a.id}`}>{a.priority}</span>
            <span data-testid={`assignment-due-${a.id}`}>{a.dueDate}</span>
            <button data-testid={`btn-start-${a.id}`} onClick={() => handleStatus(a.id, "in-progress")}>Start</button>
            <button data-testid={`btn-done-${a.id}`} onClick={() => handleStatus(a.id, "done")}>Done</button>
            <button data-testid={`btn-delete-${a.id}`} onClick={() => handleDelete(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-assignment-form">
        <input data-testid="input-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="input-subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" />
        <input data-testid="input-due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <select data-testid="select-priority" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input data-testid="input-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="input-estimated" value={estimatedMinutes} onChange={e => setEstimatedMinutes(e.target.value)} placeholder="Estimated minutes" />
        <button data-testid="btn-add-assignment" onClick={handleAdd}>Add Assignment</button>
      </div>
    </div>
  );
}
