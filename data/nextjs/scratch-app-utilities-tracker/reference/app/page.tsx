import React, { useEffect, useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Utility, Bill, Reading } from "../lib/types";

function DashboardPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  useEffect(() => {
    fetch("/api/utilities?resource=bills").then((r) => r.json()).then(setBills);
    fetch("/api/utilities?resource=utilities").then((r) => r.json()).then(setUtilities);
  }, []);

  const totalDue = bills.reduce((s, b) => s + b.amount, 0);
  const unpaidCount = bills.filter((b) => !b.paid).length;

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <div data-testid="total-due">{totalDue}</div>
      <div data-testid="unpaid-count">{unpaidCount}</div>
      <div data-testid="utility-count">{utilities.length}</div>
    </div>
  );
}

function UtilitiesPage() {
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("electricity");
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const load = () => fetch("/api/utilities?resource=utilities").then((r) => r.json()).then(setUtilities);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name) return;
    await fetch("/api/utilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "utilities", name, type, provider, accountNumber }),
    });
    setName(""); setProvider(""); setAccountNumber("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/utilities?id=${id}&resource=utilities`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="utilities-page">
      <h1>Utilities</h1>
      <input data-testid="utility-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <select data-testid="utility-type-select" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="electricity">Electricity</option>
        <option value="water">Water</option>
        <option value="gas">Gas</option>
        <option value="internet">Internet</option>
        <option value="other">Other</option>
      </select>
      <input data-testid="utility-provider-input" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
      <input data-testid="utility-account-input" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account Number" />
      <button data-testid="add-utility-btn" onClick={handleAdd}>Add Utility</button>
      <ul data-testid="utility-list">
        {utilities.map((u) => (
          <li key={u.id} data-testid={`utility-item-${u.id}`}>
            <span data-testid={`utility-name-${u.id}`}>{u.name}</span>
            <span data-testid={`utility-type-${u.id}`}>{u.type}</span>
            <button data-testid={`remove-utility-${u.id}`} onClick={() => handleRemove(u.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [utilityId, setUtilityId] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filterUtility, setFilterUtility] = useState("");

  const load = () => {
    fetch("/api/utilities?resource=bills").then((r) => r.json()).then(setBills);
    fetch("/api/utilities?resource=utilities").then((r) => r.json()).then(setUtilities);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!utilityId || !month || !amount) return;
    await fetch("/api/utilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "bills", utilityId, month, amount: Number(amount), dueDate, paid: false }),
    });
    setUtilityId(""); setMonth(""); setAmount(""); setDueDate("");
    load();
  };

  const displayed = filterUtility ? bills.filter((b) => b.utilityId === filterUtility) : bills;

  return (
    <div data-testid="bills-page">
      <h1>Bills</h1>
      <select data-testid="bill-utility-select" value={utilityId} onChange={(e) => setUtilityId(e.target.value)}>
        <option value="">Select Utility</option>
        {utilities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      <input data-testid="bill-month-input" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month (YYYY-MM)" />
      <input data-testid="bill-amount-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
      <input data-testid="bill-duedate-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due Date" />
      <button data-testid="add-bill-btn" onClick={handleAdd}>Add Bill</button>
      <select data-testid="filter-utility-select" value={filterUtility} onChange={(e) => setFilterUtility(e.target.value)}>
        <option value="">All Utilities</option>
        {utilities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      <ul data-testid="bill-list">
        {displayed.map((b) => (
          <li key={b.id} data-testid={`bill-item-${b.id}`}>
            <span data-testid={`bill-amount-${b.id}`}>{b.amount}</span>
            <span data-testid={`bill-paid-${b.id}`}>{b.paid ? "paid" : "unpaid"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsagePage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [utilityId, setUtilityId] = useState("");
  const [month, setMonth] = useState("");
  const [units, setUnits] = useState("");
  const [reading, setReading] = useState("");

  const load = () => {
    fetch("/api/utilities?resource=readings").then((r) => r.json()).then(setReadings);
    fetch("/api/utilities?resource=utilities").then((r) => r.json()).then(setUtilities);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!utilityId || !month) return;
    await fetch("/api/utilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "readings", utilityId, month, units: Number(units), reading: Number(reading) }),
    });
    setUtilityId(""); setMonth(""); setUnits(""); setReading("");
    load();
  };

  return (
    <div data-testid="usage-page">
      <h1>Usage</h1>
      <select data-testid="usage-utility-select" value={utilityId} onChange={(e) => setUtilityId(e.target.value)}>
        <option value="">Select Utility</option>
        {utilities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      <input data-testid="usage-month-input" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month (YYYY-MM)" />
      <input data-testid="usage-units-input" value={units} onChange={(e) => setUnits(e.target.value)} placeholder="Units" type="number" />
      <input data-testid="usage-reading-input" value={reading} onChange={(e) => setReading(e.target.value)} placeholder="Meter Reading" type="number" />
      <button data-testid="add-usage-btn" onClick={handleAdd}>Add Reading</button>
      <ul data-testid="reading-list">
        {readings.map((r) => (
          <li key={r.id} data-testid={`reading-item-${r.id}`}>
            <span data-testid={`reading-units-${r.id}`}>{r.units}</span>
            <span data-testid={`reading-month-${r.id}`}>{r.month}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReportsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  useEffect(() => {
    fetch("/api/utilities?resource=bills").then((r) => r.json()).then(setBills);
  }, []);

  const totalPaid = bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const totalUnpaid = bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);

  return (
    <div data-testid="reports-page">
      <h1>Reports</h1>
      <div data-testid="total-paid">{totalPaid}</div>
      <div data-testid="total-unpaid">{totalUnpaid}</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <DashboardPage />}
      {route === "/utilities" && <UtilitiesPage />}
      {route === "/bills" && <BillsPage />}
      {route === "/usage" && <UsagePage />}
      {route === "/reports" && <ReportsPage />}
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
