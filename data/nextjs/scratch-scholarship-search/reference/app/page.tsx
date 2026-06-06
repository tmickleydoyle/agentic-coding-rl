import React, { useState } from "react";

type Category = "STEM" | "General" | "Diversity" | "Arts" | "Athletics";

interface Scholarship {
  id: number;
  name: string;
  amount: number;
  deadline: string;
  category: Category;
  applied: boolean;
}

const SEED: Scholarship[] = [
  { id: 1, name: "Gates Millennium", amount: 10000, deadline: "2024-01-15", category: "STEM", applied: false },
  { id: 2, name: "Coca-Cola Scholars", amount: 20000, deadline: "2024-02-01", category: "General", applied: false },
  { id: 3, name: "NSF Graduate Fellowship", amount: 34000, deadline: "2024-10-15", category: "STEM", applied: true },
  { id: 4, name: "Hispanic Scholarship Fund", amount: 5000, deadline: "2024-03-01", category: "Diversity", applied: false },
  { id: 5, name: "Rhodes Scholarship", amount: 50000, deadline: "2024-09-30", category: "General", applied: true },
];

const CATEGORIES: Category[] = ["STEM", "General", "Diversity", "Arts", "Athletics"];

export default function App() {
  const [scholarships, setScholarships] = useState<Scholarship[]>(SEED);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("STEM");
  const [error, setError] = useState("");
  const [nextId, setNextId] = useState(6);

  const handleAdd = () => {
    const amt = Number(amount);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!amount || amt <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    setError("");
    setScholarships((prev) => [
      ...prev,
      { id: nextId, name: name.trim(), amount: amt, deadline, category: newCategory, applied: false },
    ]);
    setNextId((n) => n + 1);
    setName("");
    setAmount("");
    setDeadline("");
    setNewCategory("STEM");
  };

  const handleDelete = (id: number) => {
    setScholarships((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggle = (id: number) => {
    setScholarships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, applied: !s.applied } : s))
    );
  };

  const visible = scholarships.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "" || s.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const countTotal = scholarships.length;
  const countApplied = scholarships.filter((s) => s.applied).length;
  const totalPotential = scholarships
    .filter((s) => !s.applied)
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div>
      <h1>Scholarship Search</h1>

      <div>
        <span data-testid="count-total">Total: {countTotal}</span>
        {" | "}
        <span data-testid="count-applied">Applied: {countApplied}</span>
        {" | "}
        <span data-testid="total-potential">Potential: ${totalPotential}</span>
      </div>

      <div>
        <label>
          Search
          <input data-testid="input-search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          Category
          <select data-testid="select-category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <div>
        <label>
          Name
          <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Amount
          <input type="number" data-testid="input-amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>
          Deadline
          <input type="date" data-testid="input-deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
        <label>
          Category
          <select data-testid="select-new-category" value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <button data-testid="btn-add" onClick={handleAdd}>Add Scholarship</button>
        {error && <div data-testid="error-message">{error}</div>}
      </div>

      <div>
        {visible.map((s) => (
          <div key={s.id} data-testid="scholarship-item">
            <span data-testid="scholarship-name">{s.name}</span>
            <span data-testid="scholarship-amount">{s.amount}</span>
            <span data-testid="scholarship-deadline">{s.deadline}</span>
            <span data-testid="scholarship-category">{s.category}</span>
            <button data-testid="btn-toggle-applied" onClick={() => handleToggle(s.id)}>
              {s.applied ? "Unmark" : "Mark Applied"}
            </button>
            <button data-testid="btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
