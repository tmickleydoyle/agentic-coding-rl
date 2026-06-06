import React, { useState } from "react";

interface Bill {
  id: number;
  date: string;
  utility: string;
  amount: number;
  status: "Paid" | "Unpaid";
}

const UTILITIES = ["Electric", "Water", "Gas", "Internet", "Trash"];

const SEED: Bill[] = [
  { id: 1, date: "2024-05-15", utility: "Electric", amount: 87.5, status: "Paid" },
  { id: 2, date: "2024-05-18", utility: "Water", amount: 34.2, status: "Paid" },
  { id: 3, date: "2024-06-01", utility: "Electric", amount: 92.0, status: "Unpaid" },
  { id: 4, date: "2024-06-05", utility: "Internet", amount: 59.99, status: "Unpaid" },
  { id: 5, date: "2024-06-10", utility: "Gas", amount: 45.0, status: "Unpaid" },
];

let nextId = 6;

export default function App() {
  const [bills, setBills] = useState<Bill[]>(SEED);
  const [date, setDate] = useState("");
  const [utility, setUtility] = useState("Electric");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"Paid" | "Unpaid">("Unpaid");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  function handleAdd() {
    if (!date || amount === "") {
      setError("Date and amount are required");
      return;
    }
    const amtNum = parseFloat(amount);
    if (amtNum <= 0) {
      setError("Amount must be greater than zero");
      return;
    }
    setError("");
    setBills((prev) => [
      ...prev,
      { id: nextId++, date, utility, amount: amtNum, status },
    ]);
    setDate("");
    setUtility("Electric");
    setAmount("");
    setStatus("Unpaid");
  }

  function handleDelete(id: number) {
    setBills((prev) => prev.filter((b) => b.id !== id));
  }

  function handleMarkPaid(id: number) {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Paid" } : b))
    );
  }

  const sorted = [...bills].sort((a, b) => b.date.localeCompare(a.date));
  const filtered =
    statusFilter === "All"
      ? sorted
      : sorted.filter((b) => b.status === statusFilter);

  const totalAmount = bills.reduce((s, b) => s + b.amount, 0);
  const unpaidBills = bills.filter((b) => b.status === "Unpaid");
  const unpaidAmount = unpaidBills.reduce((s, b) => s + b.amount, 0);

  return (
    <div>
      <h1>Utility Bills Tracker</h1>

      <div>
        <label htmlFor="date-input">Date</label>
        <input
          id="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          data-testid="date-input"
        />
        <label htmlFor="utility-select">Utility</label>
        <select
          id="utility-select"
          value={utility}
          onChange={(e) => setUtility(e.target.value)}
          data-testid="utility-select"
        >
          {UTILITIES.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <label htmlFor="amount-input">Amount ($)</label>
        <input
          id="amount-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          data-testid="amount-input"
        />
        <label htmlFor="status-select">Status</label>
        <select
          id="status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as "Paid" | "Unpaid")}
          data-testid="status-select"
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
        <button onClick={handleAdd} data-testid="add-button">
          Add Bill
        </button>
        {error && <p data-testid="error-message">{error}</p>}
      </div>

      <div>
        <label htmlFor="status-filter">Filter by status</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="status-filter"
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      <div data-testid="summary">
        <span data-testid="total-amount">${totalAmount.toFixed(2)}</span>
        <span data-testid="unpaid-amount">${unpaidAmount.toFixed(2)}</span>
        <span data-testid="unpaid-count">{unpaidBills.length}</span>
      </div>

      <ul data-testid="bill-list">
        {filtered.map((bill) => (
          <li key={bill.id} data-testid={`bill-${bill.id}`}>
            <span data-testid={`bill-date-${bill.id}`}>{bill.date}</span>
            <span data-testid={`bill-utility-${bill.id}`}>{bill.utility}</span>
            <span data-testid={`bill-amount-${bill.id}`}>
              ${bill.amount.toFixed(2)}
            </span>
            <span data-testid={`bill-status-${bill.id}`}>{bill.status}</span>
            {bill.status === "Unpaid" && (
              <button
                onClick={() => handleMarkPaid(bill.id)}
                data-testid={`mark-paid-${bill.id}`}
              >
                Mark Paid
              </button>
            )}
            <button
              onClick={() => handleDelete(bill.id)}
              data-testid={`delete-${bill.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
