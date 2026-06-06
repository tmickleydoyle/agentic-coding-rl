import React, { useState } from "react";

interface Task {
  id: number;
  tank: string;
  task: string;
  dueDate: string;
  completed: boolean;
}

const TANKS = ["Reef Tank", "Freshwater", "Quarantine", "Planted"];

const SEED_TASKS: Task[] = [
  { id: 1, tank: "Reef Tank", task: "10% water change", dueDate: "2024-01-15", completed: false },
  { id: 2, tank: "Freshwater", task: "Clean filter", dueDate: "2024-01-14", completed: true },
  { id: 3, tank: "Reef Tank", task: "Test water params", dueDate: "2024-01-13", completed: false },
  { id: 4, tank: "Quarantine", task: "Medication dose", dueDate: "2024-01-12", completed: true },
  { id: 5, tank: "Planted", task: "Trim plants", dueDate: "2024-01-20", completed: false },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [tank, setTank] = useState<string>(TANKS[0]);
  const [taskDesc, setTaskDesc] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [nextId, setNextId] = useState<number>(6);

  const visible = tasks.filter((t) => {
    if (statusFilter === "Pending") return !t.completed;
    if (statusFilter === "Completed") return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  function handleAdd() {
    if (taskDesc.trim() === "") return;
    const newTask: Task = {
      id: nextId,
      tank,
      task: taskDesc.trim(),
      dueDate,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNextId(nextId + 1);
    setTaskDesc("");
  }

  function handleToggle(id: number) {
    setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function handleDelete(id: number) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <div>
      <h1>Tank Maintenance</h1>

      <section>
        <div>
          <label htmlFor="tank-select">Tank</label>
          <select
            id="tank-select"
            data-testid="tank-select"
            value={tank}
            onChange={(e) => setTank(e.target.value)}
          >
            {TANKS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="task-input">Task</label>
          <input
            id="task-input"
            type="text"
            data-testid="task-input"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="due-date-input">Due Date</label>
          <input
            id="due-date-input"
            type="date"
            data-testid="due-date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button data-testid="add-button" onClick={handleAdd}>
          Add Task
        </button>
      </section>

      <section>
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          data-testid="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </section>

      <div>
        <span data-testid="pending-count">{pendingCount} pending</span>
        <span data-testid="completed-count">{completedCount} completed</span>
      </div>

      <ul data-testid="tasks-list">
        {visible.map((t) => (
          <li key={t.id} data-testid={`task-${t.id}`}>
            <span data-testid={`task-tank-${t.id}`}>{t.tank}</span>
            <span data-testid={`task-desc-${t.id}`}>{t.task}</span>
            <span data-testid={`task-due-${t.id}`}>{t.dueDate}</span>
            <span data-testid={`task-status-${t.id}`}>{t.completed ? "Completed" : "Pending"}</span>
            <button
              data-testid={`toggle-${t.id}`}
              onClick={() => handleToggle(t.id)}
            >
              {t.completed ? "Mark Pending" : "Mark Complete"}
            </button>
            <button
              data-testid={`delete-${t.id}`}
              onClick={() => handleDelete(t.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
