import React, { useState } from "react";

const CATEGORIES = ["Food", "Vet", "Toys", "Grooming", "Other"] as const;
type Category = typeof CATEGORIES[number];

interface Expense {
  date: string;
  category: Category;
  amount: number;
  note: string;
}

interface Pet {
  id: number;
  name: string;
  species: string;
  expenses: Expense[];
}

const INITIAL_PETS: Pet[] = [
  {
    id: 1,
    name: "Charlie",
    species: "Dog",
    expenses: [
      { date: "2024-01-10", category: "Food", amount: 45.0, note: "Dog food bags" },
      { date: "2024-02-05", category: "Vet", amount: 120.0, note: "Annual checkup" },
      { date: "2024-02-20", category: "Toys", amount: 22.5, note: "Chew toys" },
    ],
  },
  {
    id: 2,
    name: "Cleo",
    species: "Cat",
    expenses: [
      { date: "2024-01-15", category: "Food", amount: 30.0, note: "Cat food" },
      { date: "2024-03-01", category: "Vet", amount: 85.0, note: "Vaccines" },
    ],
  },
];

export default function App() {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [selectedPetId, setSelectedPetId] = useState<number>(1);
  const [dateInput, setDateInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<Category>("Food");
  const [amountInput, setAmountInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const selectedPet = pets.find((p) => p.id === selectedPetId)!;
  const sortedExpenses = [...selectedPet.expenses].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const total = selectedPet.expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals: Record<string, number> = {};
  selectedPet.expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  function selectPet(id: number) {
    setSelectedPetId(id);
    clearForm();
  }

  function clearForm() {
    setDateInput("");
    setCategoryInput("Food");
    setAmountInput("");
    setNoteInput("");
  }

  function addExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!dateInput) return;
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) return;
    const expense: Expense = {
      date: dateInput,
      category: categoryInput,
      amount: amt,
      note: noteInput,
    };
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== selectedPetId) return pet;
        return { ...pet, expenses: [...pet.expenses, expense] };
      })
    );
    clearForm();
  }

  function deleteExpense(index: number) {
    const target = sortedExpenses[index];
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== selectedPetId) return pet;
        let removed = false;
        const newExpenses = pet.expenses.filter((ex) => {
          if (
            !removed &&
            ex.date === target.date &&
            ex.category === target.category &&
            ex.amount === target.amount
          ) {
            removed = true;
            return false;
          }
          return true;
        });
        return { ...pet, expenses: newExpenses };
      })
    );
  }

  return (
    <div>
      <h1>Pet Expense Tracker</h1>

      <div data-testid="pet-selector">
        {pets.map((pet) => (
          <button
            key={pet.id}
            data-testid={`pet-btn-${pet.name.toLowerCase()}`}
            onClick={() => selectPet(pet.id)}
            style={{ fontWeight: selectedPetId === pet.id ? "bold" : "normal" }}
          >
            {pet.name}
          </button>
        ))}
      </div>

      <div data-testid="pet-info">
        <span data-testid="pet-name">{selectedPet.name}</span>
        {" — "}
        <span data-testid="pet-species">{selectedPet.species}</span>
      </div>

      <div data-testid="summary-section">
        <div data-testid="total-expenses">Total: ${total.toFixed(2)}</div>
        <div data-testid="category-breakdown">
          {Object.keys(categoryTotals).map((cat) => (
            <div key={cat} data-testid={`category-${cat.toLowerCase()}`}>
              {cat}: ${categoryTotals[cat].toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      {sortedExpenses.length === 0 ? (
        <p data-testid="no-expenses-msg">No expenses recorded</p>
      ) : (
        <table data-testid="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((exp, i) => (
              <tr key={i} data-testid={`expense-row-${i}`}>
                <td>{exp.date}</td>
                <td>{exp.category}</td>
                <td>${exp.amount.toFixed(2)}</td>
                <td>{exp.note}</td>
                <td>
                  <button
                    data-testid={`delete-expense-${i}`}
                    onClick={() => deleteExpense(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={addExpense} data-testid="add-expense-form">
        <h2>Add Expense</h2>
        <label>
          Date
          <input
            type="date"
            data-testid="expense-date-input"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            data-testid="expense-category-select"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Amount ($)
          <input
            type="number"
            step="0.01"
            data-testid="expense-amount-input"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
        </label>
        <label>
          Note
          <input
            data-testid="expense-note-input"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
        </label>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}
