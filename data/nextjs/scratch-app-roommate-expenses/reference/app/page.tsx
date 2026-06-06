import React, { useEffect, useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Roommate, Expense, Settlement } from "../lib/types";

function DashboardPage() {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetch("/api/expenses?resource=roommates").then((r) => r.json()).then(setRoommates);
    fetch("/api/expenses?resource=expenses").then((r) => r.json()).then(setExpenses);
  }, []);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <div data-testid="total-expenses">{totalExpenses}</div>
      <div data-testid="roommate-count">{roommates.length}</div>
    </div>
  );
}

function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const load = () => {
    fetch("/api/expenses?resource=expenses").then((r) => r.json()).then(setExpenses);
    fetch("/api/expenses?resource=roommates").then((r) => r.json()).then(setRoommates);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!description || !amount || !payerId) return;
    const splitWith = roommates.map((r) => r.id);
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "expenses", description, amount: Number(amount), payerId, splitWith, date, category }),
    });
    setDescription(""); setAmount(""); setPayerId(""); setDate(""); setCategory("");
    load();
  };

  return (
    <div data-testid="expenses-page">
      <h1>Expenses</h1>
      <input data-testid="expense-description-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input data-testid="expense-amount-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
      <select data-testid="expense-payer-select" value={payerId} onChange={(e) => setPayerId(e.target.value)}>
        <option value="">Select Payer</option>
        {roommates.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
      <input data-testid="expense-date-input" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
      <input data-testid="expense-category-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <button data-testid="add-expense-btn" onClick={handleAdd}>Add Expense</button>
      <ul data-testid="expense-list">
        {expenses.map((e) => (
          <li key={e.id} data-testid={`expense-item-${e.id}`}>
            <span data-testid={`expense-desc-${e.id}`}>{e.description}</span>
            <span data-testid={`expense-amount-${e.id}`}>{e.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoommatesPage() {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const load = () => fetch("/api/expenses?resource=roommates").then((r) => r.json()).then(setRoommates);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name) return;
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "roommates", name, email }),
    });
    setName(""); setEmail("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/expenses?id=${id}&resource=roommates`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="roommates-page">
      <h1>Roommates</h1>
      <input data-testid="roommate-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="roommate-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button data-testid="add-roommate-btn" onClick={handleAdd}>Add Roommate</button>
      <ul data-testid="roommate-list">
        {roommates.map((r) => (
          <li key={r.id} data-testid={`roommate-item-${r.id}`}>
            <span data-testid={`roommate-name-${r.id}`}>{r.name}</span>
            <button data-testid={`remove-roommate-${r.id}`} onClick={() => handleRemove(r.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettlePage() {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("/api/expenses?resource=roommates").then((r) => r.json()).then(setRoommates);
  }, []);

  const handleSettle = async () => {
    if (!fromId || !toId || !amount) return;
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "settlements", fromId, toId, amount: Number(amount), date }),
    });
    setFromId(""); setToId(""); setAmount(""); setDate("");
  };

  return (
    <div data-testid="settle-page">
      <h1>Settle Up</h1>
      <select data-testid="settle-from-select" value={fromId} onChange={(e) => setFromId(e.target.value)}>
        <option value="">From</option>
        {roommates.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
      <select data-testid="settle-to-select" value={toId} onChange={(e) => setToId(e.target.value)}>
        <option value="">To</option>
        {roommates.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
      <input data-testid="settle-amount-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
      <input data-testid="settle-date-input" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
      <button data-testid="settle-btn" onClick={handleSettle}>Settle</button>
    </div>
  );
}

function HistoryPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  useEffect(() => {
    fetch("/api/expenses?resource=settlements").then((r) => r.json()).then(setSettlements);
  }, []);

  return (
    <div data-testid="history-page">
      <h1>History</h1>
      <ul data-testid="settlement-list">
        {settlements.map((s) => (
          <li key={s.id} data-testid={`settlement-item-${s.id}`}>
            <span data-testid={`settlement-amount-${s.id}`}>{s.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <DashboardPage />}
      {route === "/expenses" && <ExpensesPage />}
      {route === "/roommates" && <RoommatesPage />}
      {route === "/settle" && <SettlePage />}
      {route === "/history" && <HistoryPage />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
