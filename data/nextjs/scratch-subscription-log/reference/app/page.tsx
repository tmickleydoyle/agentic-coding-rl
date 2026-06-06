import React, { useState } from "react";

type Status = "active" | "paused" | "cancelled";

interface Subscription {
  id: number;
  name: string;
  costPerMonth: number;
  renewalDate: string;
  category: string;
  status: Status;
}

const SEED_DATA: Subscription[] = [
  { id: 1, name: "GitHub Pro", costPerMonth: 4.0, renewalDate: "2024-02-15", category: "Development", status: "active" },
  { id: 2, name: "Figma", costPerMonth: 15.0, renewalDate: "2024-03-01", category: "Design", status: "active" },
  { id: 3, name: "Linear", costPerMonth: 8.0, renewalDate: "2024-01-20", category: "Productivity", status: "paused" },
  { id: 4, name: "Vercel Pro", costPerMonth: 20.0, renewalDate: "2024-02-28", category: "Hosting", status: "active" },
  { id: 5, name: "Notion", costPerMonth: 10.0, renewalDate: "2024-04-05", category: "Productivity", status: "cancelled" },
];

const STATUS_CYCLE: Status[] = ["active", "paused", "cancelled"];

function nextStatus(current: Status): Status {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

export default function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(SEED_DATA);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [nextId, setNextId] = useState(6);

  const [inputName, setInputName] = useState("");
  const [inputCost, setInputCost] = useState("");
  const [inputRenewalDate, setInputRenewalDate] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [inputStatus, setInputStatus] = useState<Status>("active");

  const totalCost = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.costPerMonth, 0);

  const activeCount = subscriptions.filter((s) => s.status === "active").length;

  const displayed =
    filter === "all" ? subscriptions : subscriptions.filter((s) => s.status === filter);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const cost = parseFloat(inputCost);
    if (!inputName.trim() || isNaN(cost) || cost <= 0) return;
    const newSub: Subscription = {
      id: nextId,
      name: inputName.trim(),
      costPerMonth: cost,
      renewalDate: inputRenewalDate,
      category: inputCategory.trim(),
      status: inputStatus,
    };
    setSubscriptions((prev) => [...prev, newSub]);
    setNextId((n) => n + 1);
    setInputName("");
    setInputCost("");
    setInputRenewalDate("");
    setInputCategory("");
    setInputStatus("active");
  }

  function handleDelete(id: number) {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }

  function handleToggle(id: number) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus(s.status) } : s))
    );
  }

  return (
    <div>
      <h1>Subscription Log</h1>

      <div>
        <span data-testid="total-cost">${totalCost.toFixed(2)}/mo</span>
        <span data-testid="active-count">{activeCount}</span>
      </div>

      <div>
        {(["all", "active", "paused", "cancelled"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {displayed.length === 0 ? (
          <div data-testid="empty-message">No subscriptions found.</div>
        ) : (
          displayed.map((s) => (
            <div key={s.id} data-testid="subscription-item">
              <span>{s.name}</span>
              <span>${s.costPerMonth.toFixed(2)}/mo</span>
              <span>{s.renewalDate}</span>
              <span>{s.category}</span>
              <span data-testid="status-badge">{s.status}</span>
              <button data-testid="delete-btn" onClick={() => handleDelete(s.id)}>
                Delete
              </button>
              <button onClick={() => handleToggle(s.id)}>Toggle Status</button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd}>
        <label>
          Name
          <input
            data-testid="input-name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
        </label>
        <label>
          Cost ($/mo)
          <input
            type="number"
            data-testid="input-cost"
            value={inputCost}
            onChange={(e) => setInputCost(e.target.value)}
          />
        </label>
        <label>
          Renewal Date
          <input
            type="date"
            data-testid="input-renewal-date"
            value={inputRenewalDate}
            onChange={(e) => setInputRenewalDate(e.target.value)}
          />
        </label>
        <label>
          Category
          <input
            data-testid="input-category"
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
          />
        </label>
        <label>
          Status
          <select
            data-testid="input-status"
            value={inputStatus}
            onChange={(e) => setInputStatus(e.target.value as Status)}
          >
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="cancelled">cancelled</option>
          </select>
        </label>
        <button type="submit">Add Subscription</button>
      </form>
    </div>
  );
}
