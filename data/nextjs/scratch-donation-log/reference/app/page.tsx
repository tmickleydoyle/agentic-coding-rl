import React, { useState } from "react";

interface DonationEntry {
  id: number;
  donorName: string;
  email: string;
  amount: number;
  cause: string;
  date: string;
}

const CAUSES = ["Education", "Health", "Environment", "Arts", "Other"];

const SEED_ENTRIES: DonationEntry[] = [
  { id: 1, donorName: "Alice Johnson", email: "alice@example.com", amount: 50.0, cause: "Education", date: "2024-01-10" },
  { id: 2, donorName: "Bob Smith", email: "bob@example.com", amount: 120.0, cause: "Health", date: "2024-02-05" },
  { id: 3, donorName: "Carol Davis", email: "carol@example.com", amount: 75.0, cause: "Education", date: "2024-02-20" },
  { id: 4, donorName: "Alice Johnson", email: "alice@example.com", amount: 200.0, cause: "Environment", date: "2024-03-01" },
  { id: 5, donorName: "Dave Wilson", email: "dave@example.com", amount: 30.0, cause: "Health", date: "2024-03-15" },
];

let nextId = 6;

export default function App() {
  const [entries, setEntries] = useState<DonationEntry[]>(SEED_ENTRIES);
  const [donorNameInput, setDonorNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [causeInput, setCauseInput] = useState(CAUSES[0]);
  const [dateInput, setDateInput] = useState("");
  const [filterCause, setFilterCause] = useState("All");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const handleAdd = () => {
    const amount = parseFloat(amountInput);
    if (
      !donorNameInput.trim() ||
      !emailInput.includes("@") ||
      !amountInput ||
      amount <= 0 ||
      !dateInput
    ) {
      return;
    }
    const newEntry: DonationEntry = {
      id: nextId++,
      donorName: donorNameInput.trim(),
      email: emailInput.trim(),
      amount,
      cause: causeInput,
      date: dateInput,
    };
    setEntries([newEntry, ...entries]);
    setDonorNameInput("");
    setEmailInput("");
    setAmountInput("");
    setCauseInput(CAUSES[0]);
    setDateInput("");
  };

  const handleDelete = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const filteredEntries = entries.filter((e) => {
    if (filterCause !== "All" && e.cause !== filterCause) return false;
    if (filterFrom && e.date < filterFrom) return false;
    if (filterTo && e.date > filterTo) return false;
    return true;
  });

  const totalDonations = entries.length;
  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
  const uniqueDonors = new Set(entries.map((e) => e.donorName)).size;

  return (
    <div>
      <h1>Donation Log</h1>

      <section>
        <h2>Log Donation</h2>
        <label htmlFor="donor-name">Donor Name</label>
        <input
          id="donor-name"
          type="text"
          value={donorNameInput}
          onChange={(e) => setDonorNameInput(e.target.value)}
          data-testid="input-donor-name"
        />
        <label htmlFor="donor-email">Email</label>
        <input
          id="donor-email"
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          data-testid="input-email"
        />
        <label htmlFor="donor-amount">Amount</label>
        <input
          id="donor-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          data-testid="input-amount"
        />
        <label htmlFor="donor-cause">Cause</label>
        <select
          id="donor-cause"
          value={causeInput}
          onChange={(e) => setCauseInput(e.target.value)}
          data-testid="input-cause"
        >
          {CAUSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label htmlFor="donor-date">Date</label>
        <input
          id="donor-date"
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          data-testid="input-date"
        />
        <button onClick={handleAdd} data-testid="btn-log">
          Log Donation
        </button>
      </section>

      <section>
        <label htmlFor="filter-cause">Filter by cause</label>
        <select
          id="filter-cause"
          value={filterCause}
          onChange={(e) => setFilterCause(e.target.value)}
          data-testid="filter-cause"
        >
          <option value="All">All</option>
          {CAUSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label htmlFor="filter-from">From:</label>
        <input
          id="filter-from"
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
          data-testid="filter-from"
        />
        <label htmlFor="filter-to">To:</label>
        <input
          id="filter-to"
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
          data-testid="filter-to"
        />
      </section>

      <section>
        <h2>Donations</h2>
        {filteredEntries.length === 0 ? (
          <p data-testid="empty-message">No donations logged.</p>
        ) : (
          <ul data-testid="entries-list">
            {filteredEntries.map((entry) => (
              <li key={entry.id} data-testid={`entry-${entry.id}`}>
                <span data-testid={`entry-donor-${entry.id}`}>{entry.donorName}</span>
                {" — "}
                <span data-testid={`entry-email-${entry.id}`}>{entry.email}</span>
                {" — "}
                <span data-testid={`entry-amount-${entry.id}`}>${entry.amount.toFixed(2)}</span>
                {" — "}
                <span data-testid={`entry-cause-${entry.id}`}>{entry.cause}</span>
                {" — "}
                <span data-testid={`entry-date-${entry.id}`}>{entry.date}</span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  data-testid={`btn-delete-${entry.id}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Summary</h2>
        <p data-testid="total-donations">Total Donations: {totalDonations}</p>
        <p data-testid="total-amount">Total Amount: ${totalAmount.toFixed(2)}</p>
        <p data-testid="unique-donors">Unique Donors: {uniqueDonors}</p>
      </section>
    </div>
  );
}
