import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { TaskTemplate, TaskCategory } from "../../lib/types";

const CATEGORIES: TaskCategory[] = ["HR", "IT", "Legal", "Culture"];

export default function TasksPage() {
  const { templates, checklist, setTemplates, setChecklist } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueOffset, setDueOffset] = useState("1");
  const [category, setCategory] = useState<TaskCategory>("HR");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!title.trim()) { setError("Title required"); return; }
    setError("");
    const t: TaskTemplate = { id: String(Date.now()), title: title.trim(), description, dueOffset: parseInt(dueOffset, 10), category };
    setTemplates([...templates, t]);
    setTitle(""); setDescription("");
  }

  function handleDelete(id: string) {
    setTemplates(templates.filter((t) => t.id !== id));
    setChecklist(checklist.filter((c) => c.templateId !== id));
  }

  return (
    <div data-testid="tasks-page">
      <h1>Task Templates</h1>
      {error && <div data-testid="task-error">{error}</div>}
      <div data-testid="add-task-form">
        <input data-testid="task-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="task-desc-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="task-offset-input" type="number" value={dueOffset} onChange={(e) => setDueOffset(e.target.value)} />
        <select data-testid="task-category-select" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="add-task-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="task-list">
        {templates.map((t) => (
          <li key={t.id} data-testid={`task-item-${t.id}`}>
            <span data-testid={`task-title-${t.id}`}>{t.title}</span>
            <span data-testid={`task-category-${t.id}`}>{t.category}</span>
            <span data-testid={`task-offset-${t.id}`}>+{t.dueOffset}d</span>
            <button data-testid={`delete-task-${t.id}`} onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
