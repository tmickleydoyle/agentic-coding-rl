import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { EntryStatus } from "../../lib/types";

export function EntriesPage() {
  const { entries, addEntry, deleteEntry } = useApp();
  const [heir, setHeir] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<EntryStatus>("Pending");

  const handleAdd = () => {
    const num = parseFloat(amount);
    if (!heir || !date || isNaN(num) || num <= 0) return;
    addEntry({ heir, amount: num, date, status });
    setHeir(""); setAmount(""); setDate("");
  };

  return (
    <div data-testid="entries-page">
      <h1>Inheritance Entries</h1>
      {entries.length === 0 ? (
        <p data-testid="no-entries">No entries found.</p>
      ) : (
        <ul data-testid="entry-list">
          {entries.map((e) => (
            <li key={e.id} data-testid={`entry-item-${e.id}`}>
              <span data-testid={`entry-heir-${e.id}`}>{e.heir}</span>
              <span data-testid={`entry-amount-${e.id}`}>${e.amount.toLocaleString()}</span>
              <span data-testid={`entry-date-${e.id}`}>{e.date}</span>
              <span data-testid={`entry-status-${e.id}`}>{e.status}</span>
              <button data-testid={`delete-entry-${e.id}`} onClick={() => deleteEntry(e.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-entry-form">
        <input data-testid="entry-heir-input" value={heir} onChange={(e) => setHeir(e.target.value)} placeholder="Heir" />
        <input data-testid="entry-amount-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input data-testid="entry-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select data-testid="entry-status-select" value={status} onChange={(e) => setStatus(e.target.value as EntryStatus)}>
          <option>Pending</option>
          <option>Transferred</option>
          <option>Disputed</option>
        </select>
        <button data-testid="add-entry-btn" onClick={handleAdd}>Add Entry</button>
      </div>
    </div>
  );
}
