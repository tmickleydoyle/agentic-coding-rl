import React, { useState, useEffect } from "react";
import { ActionItem, Priority } from "../../lib/types";

const PRIORITIES: Priority[] = ["low", "medium", "high"];

export function ItemsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const load = () => fetch("/api/items").then((r) => r.json()).then((d) => setItems(d.items ?? []));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), assignee, dueDate, priority, notes, completed: false }),
    });
    setTitle(""); setAssignee(""); setDueDate(""); setPriority("medium"); setNotes(""); setError(""); load();
  };

  const toggle = async (item: ActionItem) => {
    await fetch(`/api/items?id=${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !item.completed }),
    });
    load();
  };

  const del = async (id: string) => { await fetch(`/api/items?id=${id}`, { method: "DELETE" }); load(); };

  const open = items.filter((i) => !i.completed);

  return (
    <div data-testid="items-page">
      <h1>Action Items</h1>
      {error && <p data-testid="form-error">{error}</p>}
      <div data-testid="item-form">
        <input data-testid="input-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="input-assignee" placeholder="Assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
        <input data-testid="input-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select data-testid="input-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <textarea data-testid="input-notes" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button data-testid="btn-submit" onClick={submit}>Add Item</button>
      </div>
      <ul data-testid="items-list">
        {open.map((item) => (
          <li key={item.id} data-testid={`item-row-${item.id}`}>
            <input type="checkbox" data-testid={`item-check-${item.id}`} checked={item.completed} onChange={() => toggle(item)} />
            <span data-testid={`item-title-${item.id}`}>{item.title}</span>
            <span data-testid={`item-priority-${item.id}`}>{item.priority}</span>
            <span data-testid={`item-assignee-${item.id}`}>{item.assignee}</span>
            <button data-testid={`btn-delete-${item.id}`} onClick={() => del(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
