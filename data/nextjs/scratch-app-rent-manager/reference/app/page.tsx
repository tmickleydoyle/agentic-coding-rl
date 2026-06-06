import React, { useEffect, useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Tenant, Payment } from "../lib/types";

function DashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetch("/api/rent/tenants").then((r) => r.json()).then(setTenants);
    fetch("/api/rent/payments").then((r) => r.json()).then(setPayments);
  }, []);

  const totalExpected = tenants.filter((t) => t.status === "active").reduce((s, t) => s + t.monthlyRent, 0);
  const totalCollected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <div data-testid="total-expected">{totalExpected}</div>
      <div data-testid="total-collected">{totalCollected}</div>
      <div data-testid="tenant-count">{tenants.length}</div>
    </div>
  );
}

function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");

  const load = () => fetch("/api/rent/tenants").then((r) => r.json()).then(setTenants);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name || !unit || !monthlyRent) return;
    await fetch("/api/rent/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, unit, monthlyRent: Number(monthlyRent), leaseStart, leaseEnd, status: "active" }),
    });
    setName(""); setUnit(""); setMonthlyRent(""); setLeaseStart(""); setLeaseEnd("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/rent/tenants?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="tenants-page">
      <h1>Tenants</h1>
      <input data-testid="tenant-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="tenant-unit-input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" />
      <input data-testid="tenant-rent-input" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} placeholder="Monthly Rent" type="number" />
      <input data-testid="tenant-lease-start-input" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} placeholder="Lease Start" />
      <input data-testid="tenant-lease-end-input" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} placeholder="Lease End" />
      <button data-testid="add-tenant-btn" onClick={handleAdd}>Add Tenant</button>
      <ul data-testid="tenant-list">
        {tenants.map((t) => (
          <li key={t.id} data-testid={`tenant-item-${t.id}`}>
            <span data-testid={`tenant-name-${t.id}`}>{t.name}</span>
            <span data-testid={`tenant-unit-${t.id}`}>{t.unit}</span>
            <span data-testid={`tenant-rent-${t.id}`}>{t.monthlyRent}</span>
            <button data-testid={`remove-tenant-${t.id}`} onClick={() => handleRemove(t.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const load = () => {
    fetch("/api/rent/payments").then((r) => r.json()).then(setPayments);
    fetch("/api/rent/tenants").then((r) => r.json()).then(setTenants);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!tenantId || !amount || !date || !month) return;
    await fetch("/api/rent/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, amount: Number(amount), date, month, status: "paid" }),
    });
    setTenantId(""); setAmount(""); setDate(""); setMonth("");
    load();
  };

  const displayed = filterMonth ? payments.filter((p) => p.month === filterMonth) : payments;

  return (
    <div data-testid="payments-page">
      <h1>Payments</h1>
      <select data-testid="payment-tenant-select" value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
        <option value="">Select Tenant</option>
        {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <input data-testid="payment-amount-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
      <input data-testid="payment-date-input" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
      <input data-testid="payment-month-input" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month (YYYY-MM)" />
      <button data-testid="add-payment-btn" onClick={handleAdd}>Add Payment</button>
      <input data-testid="filter-month-input" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} placeholder="Filter by month" />
      <ul data-testid="payment-list">
        {displayed.map((p) => (
          <li key={p.id} data-testid={`payment-item-${p.id}`}>
            <span data-testid={`payment-amount-${p.id}`}>{p.amount}</span>
            <span data-testid={`payment-status-${p.id}`}>{p.status}</span>
            <span data-testid={`payment-month-${p.id}`}>{p.month}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsPage() {
  return (
    <div data-testid="settings-page">
      <h1>Settings</h1>
      <p data-testid="settings-info">Property settings and configuration</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <DashboardPage />}
      {route === "/tenants" && <TenantsPage />}
      {route === "/payments" && <PaymentsPage />}
      {route === "/settings" && <SettingsPage />}
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
