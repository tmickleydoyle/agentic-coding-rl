import React, { useState } from "react";

interface DonationRecord {
  id: number;
  charity: string;
  category: string;
  amount: number;
  date: string;
}

const CATEGORIES = ["Disaster", "Hunger", "Animals", "Children", "Education", "Other"];

const SEED_RECORDS: DonationRecord[] = [
  { id: 1, charity: "Red Cross", category: "Disaster", amount: 100.0, date: "2024-01-15" },
  { id: 2, charity: "Local Food Bank", category: "Hunger", amount: 50.0, date: "2024-02-01" },
  { id: 3, charity: "Animal Rescue League", category: "Animals", amount: 75.0, date: "2024-02-14" },
  { id: 4, charity: "Red Cross", category: "Disaster", amount: 200.0, date: "2024-03-01" },
  { id: 5, charity: "UNICEF", category: "Children", amount: 150.0, date: "2024-03-10" },
];

let nextId = 6;

export default function App() {
  const [records, setRecords] = useState<DonationRecord[]>(SEED_RECORDS);
  const [charityInput, setCharityInput] = useState("");
  const [categoryInput, setCategoryInput] = useState(CATEGORIES[0]);
  const [amountInput, setAmountInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleAdd = () => {
    const amount = parseFloat(amountInput);
    if (!charityInput.trim() || !amountInput || !dateInput || amount <= 0) {
      return;
    }
    const newRecord: DonationRecord = {
      id: nextId++,
      charity: charityInput.trim(),
      category: categoryInput,
      amount,
      date: dateInput,
    };
    setRecords([newRecord, ...records]);
    setCharityInput("");
    setCategoryInput(CATEGORIES[0]);
    setAmountInput("");
    setDateInput("");
  };

  const handleRemove = (id: number) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const filteredRecords =
    filterCategory === "All"
      ? records
      : records.filter((r) => r.category === filterCategory);

  const totalDonated = records.reduce((sum, r) => sum + r.amount, 0);

  const charityTotals: { name: string; total: number }[] = [];
  records.forEach((r) => {
    const existing = charityTotals.find((c) => c.name === r.charity);
    if (existing) {
      existing.total += r.amount;
    } else {
      charityTotals.push({ name: r.charity, total: r.amount });
    }
  });

  return (
    <div>
      <h1>Charity Tracker</h1>

      <section>
        <h2>Add Donation</h2>
        <label htmlFor="charity-input">Charity</label>
        <input
          id="charity-input"
          type="text"
          value={charityInput}
          onChange={(e) => setCharityInput(e.target.value)}
          data-testid="input-charity"
        />
        <label htmlFor="category-input">Category</label>
        <select
          id="category-input"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          data-testid="input-category"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label htmlFor="amount-input">Amount</label>
        <input
          id="amount-input"
          type="number"
          min="0.01"
          step="0.01"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          data-testid="input-amount"
        />
        <label htmlFor="date-input">Date</label>
        <input
          id="date-input"
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          data-testid="input-date"
        />
        <button onClick={handleAdd} data-testid="btn-add">
          Add Donation
        </button>
      </section>

      <section>
        <label htmlFor="filter-category">Filter by category</label>
        <select
          id="filter-category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          data-testid="filter-category"
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      <section>
        <h2>Donations</h2>
        {filteredRecords.length === 0 ? (
          <p data-testid="empty-message">No donations recorded.</p>
        ) : (
          <ul data-testid="records-list">
            {filteredRecords.map((record) => (
              <li key={record.id} data-testid={`record-${record.id}`}>
                <span data-testid={`record-charity-${record.id}`}>{record.charity}</span>
                {" — "}
                <span data-testid={`record-category-${record.id}`}>{record.category}</span>
                {" — "}
                <span data-testid={`record-amount-${record.id}`}>${record.amount.toFixed(2)}</span>
                {" — "}
                <span data-testid={`record-date-${record.id}`}>{record.date}</span>
                <button
                  onClick={() => handleRemove(record.id)}
                  data-testid={`btn-remove-${record.id}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Summary</h2>
        <p data-testid="total-donated">Total Donated: ${totalDonated.toFixed(2)}</p>
        <ul data-testid="charity-summary">
          {charityTotals.map((c) => (
            <li key={c.name} data-testid={`charity-total-${c.name.replace(/\s+/g, "-")}`}>
              {c.name}: ${c.total.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
