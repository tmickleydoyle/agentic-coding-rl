import React, { useState } from "react";

interface Category {
  id: number;
  category: string;
  budgeted: number;
  spent: number;
}

const TOTAL_BUDGET = 30000;

const SEED_CATEGORIES: Category[] = [
  { id: 1, category: "Venue", budgeted: 10000, spent: 9500 },
  { id: 2, category: "Catering", budgeted: 8000, spent: 8200 },
  { id: 3, category: "Photography", budgeted: 3000, spent: 2800 },
  { id: 4, category: "Flowers", budgeted: 2000, spent: 1800 },
  { id: 5, category: "Music", budgeted: 2000, spent: 1500 },
  { id: 6, category: "Attire", budgeted: 3000, spent: 3100 },
];

export default function App() {
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [expenseCategoryId, setExpenseCategoryId] = useState<number>(1);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");

  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const totalRemaining = TOTAL_BUDGET - totalSpent;
  const overallPercent = Math.round((totalSpent / TOTAL_BUDGET) * 100);

  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) return;
    setCategories((prev) =>
      prev.map((c) => c.id === expenseCategoryId ? { ...c, spent: c.spent + amount } : c)
    );
    setExpenseAmount("");
    setShowExpenseForm(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const budget = parseFloat(newCategoryBudget);
    if (isNaN(budget) || budget <= 0) return;
    const maxId = categories.reduce((m, c) => Math.max(m, c.id), 0);
    setCategories((prev) => [...prev, { id: maxId + 1, category: newCategoryName.trim(), budgeted: budget, spent: 0 }]);
    setNewCategoryName("");
    setNewCategoryBudget("");
    setShowCategoryForm(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Wedding Budget</h1>

      <div data-testid="overall-summary" style={{ marginBottom: 8, fontWeight: "bold" }}>
        Total Budget: ${TOTAL_BUDGET} | Total Spent: ${totalSpent} | Remaining: ${totalRemaining}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ background: "#eee", borderRadius: 4, height: 20, position: "relative" as const }}>
          <div
            data-testid="overall-progress"
            style={{
              background: overallPercent > 100 ? "#dc3545" : "#28a745",
              width: `${Math.min(overallPercent, 100)}%`,
              height: "100%",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
            }}
          >
            {overallPercent}%
          </div>
        </div>
      </div>

      {categories.map((cat) => {
        const remaining = cat.budgeted - cat.spent;
        const catPercent = Math.min(Math.round((cat.spent / cat.budgeted) * 100), 100);
        return (
          <div
            key={cat.id}
            data-testid={`category-row-${cat.id}`}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}
          >
            <h3 style={{ margin: "0 0 4px 0" }}>{cat.category}</h3>
            <div data-testid={`category-detail-${cat.id}`} style={{ marginBottom: 4 }}>
              Budgeted: ${cat.budgeted} | Spent: ${cat.spent} | Remaining: ${remaining}
            </div>
            {cat.spent > cat.budgeted && (
              <div data-testid={`over-budget-${cat.id}`} style={{ color: "#dc3545", fontWeight: "bold", marginBottom: 4 }}>
                Over Budget!
              </div>
            )}
            <div style={{ background: "#eee", borderRadius: 4, height: 12 }}>
              <div
                data-testid={`category-progress-${cat.id}`}
                style={{
                  background: cat.spent > cat.budgeted ? "#dc3545" : "#007bff",
                  width: `${catPercent}%`,
                  height: "100%",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {!showExpenseForm && (
          <button data-testid="add-expense-btn" onClick={() => setShowExpenseForm(true)}>Add Expense</button>
        )}
        {!showCategoryForm && (
          <button data-testid="add-category-btn" onClick={() => setShowCategoryForm(true)}>Add Category</button>
        )}
      </div>

      {showExpenseForm && (
        <div data-testid="expense-form" style={{ border: "1px solid #ccc", padding: 16, borderRadius: 4, marginBottom: 12 }}>
          <h3>Add Expense</h3>
          <div style={{ marginBottom: 8 }}>
            <label>
              Category:{" "}
              <select
                aria-label="Expense Category"
                value={expenseCategoryId}
                onChange={(e) => setExpenseCategoryId(Number(e.target.value))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.category}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Amount:{" "}
              <input
                type="number"
                aria-label="Expense Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </label>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAddExpense}>Save</button>
            <button onClick={() => { setShowExpenseForm(false); setExpenseAmount(""); }}>Cancel</button>
          </div>
        </div>
      )}

      {showCategoryForm && (
        <div data-testid="category-form" style={{ border: "1px solid #ccc", padding: 16, borderRadius: 4 }}>
          <h3>Add Category</h3>
          <div style={{ marginBottom: 8 }}>
            <label>
              Category Name:{" "}
              <input
                type="text"
                aria-label="Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Budget Amount:{" "}
              <input
                type="number"
                aria-label="Budget Amount"
                value={newCategoryBudget}
                onChange={(e) => setNewCategoryBudget(e.target.value)}
              />
            </label>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAddCategory}>Save</button>
            <button onClick={() => { setShowCategoryForm(false); setNewCategoryName(""); setNewCategoryBudget(""); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
