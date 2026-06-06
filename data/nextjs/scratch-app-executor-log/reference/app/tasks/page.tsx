import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { TaskStatus } from "../../lib/types";

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  Todo: "InProgress",
  InProgress: "Done",
  Done: "Todo",
};

export function TasksPage() {
  const { tasks, addTask, deleteTask, updateTaskStatus } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Todo");

  const handleAdd = () => {
    if (!title) return;
    addTask({ title, description, due, status });
    setTitle(""); setDescription(""); setDue("");
  };

  return (
    <div data-testid="tasks-page">
      <h1>Executor Tasks</h1>
      {tasks.length === 0 ? (
        <p data-testid="no-tasks">No tasks found.</p>
      ) : (
        <ul data-testid="task-list">
          {tasks.map((t) => (
            <li key={t.id} data-testid={`task-item-${t.id}`}>
              <span data-testid={`task-title-${t.id}`}>{t.title}</span>
              <span data-testid={`task-due-${t.id}`}>{t.due}</span>
              <span data-testid={`task-status-${t.id}`}>{t.status}</span>
              <button data-testid={`advance-task-${t.id}`} onClick={() => updateTaskStatus(t.id, NEXT_STATUS[t.status])}>
                Advance
              </button>
              <button data-testid={`delete-task-${t.id}`} onClick={() => deleteTask(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-task-form">
        <input data-testid="task-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="task-desc-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="task-due-input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        <select data-testid="task-status-select" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
          <option>Todo</option>
          <option>InProgress</option>
          <option>Done</option>
        </select>
        <button data-testid="add-task-btn" onClick={handleAdd}>Add Task</button>
      </div>
    </div>
  );
}
